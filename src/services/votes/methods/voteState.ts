export default function voteState(currentVote: any, newVote: any): number {
  let votedState = 0;
  if (newVote) {
    votedState = currentVote ? 0 : 1;
  } else {
    votedState = currentVote ? -1 : 0;
  }
  return votedState;
}
