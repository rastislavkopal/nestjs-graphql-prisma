import { GraphqlConfig } from './common/configs/config.interface';
import { ConfigService } from '@nestjs/config';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService) {}

  createGqlOptions(): ApolloDriverConfig {
    const graphqlConfig = this.configService.get<GraphqlConfig>('graphql');
    return {
      autoSchemaFile: graphqlConfig.schemaDestination || './src/schema.graphql',
      sortSchema: graphqlConfig.sortSchema,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      installSubscriptionHandlers: true,
      includeStacktraceInErrorResponses: graphqlConfig.debug,
      playground: graphqlConfig.playgroundEnabled,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      context: this.createContext(),
    };
  }

  createContext() {
    return (context) => {
      if (context?.extra?.request) {
        const authorization =
          context?.connectionParams?.Authorization ||
          context?.connectionParams?.authorization;

        return this.createRequestObject(context, authorization);
      }
      return { req: context?.req, res: context?.res };
    };
  }

  createRequestObject(context, authorization: string) {
    return {
      req: {
        ...context?.extra?.request,
        headers: {
          ...context?.extra?.request?.headers,
          ...context?.connectionParams,
          authorization: authorization, // force authorization header lowercase
        },
      },
    };
  }
}
