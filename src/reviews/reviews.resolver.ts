import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './models/review.model';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { LoggedUser } from '../common/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ReviewConnection } from './models/review-connection.model';
import { PaginationArgs } from '../common/pagination/pagination.args';

@Resolver(() => Review)
@UseGuards(GqlAuthGuard)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => Review)
  createReview(
    @LoggedUser() loggedUser: User,
    @Args('data') input: CreateReviewInput,
  ) {
    return this.reviewsService.create(loggedUser, input);
  }

  @Query(() => ReviewConnection, { name: 'reviews' })
  findAll(
    @LoggedUser() loggedUser: User,
    @Args() paginatedArgs: PaginationArgs,
    @Args('organizerId', { nullable: true }) organizerId?: string,
    @Args('tripId', { nullable: true }) tripId?: string,
  ) {
    return this.reviewsService.findAll(
      loggedUser,
      paginatedArgs,
      organizerId,
      tripId,
    );
  }

  @Query(() => Review, { name: 'review' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  // TODO admin only
  @Mutation(() => Review)
  updateReview(@Args('data') updateReviewInput: UpdateReviewInput) {
    return this.reviewsService.update(updateReviewInput.id, updateReviewInput);
  }

  // TODO admin only
  @Mutation(() => Review)
  removeReview(@Args('id', { type: () => String }) id: string) {
    return this.reviewsService.remove(id);
  }
}
