export default function voteState(currentVote: number, newVote: any): number {
  if(newVote && currentVote != 1) {
    currentVote += 1
  }
  if(!newVote && currentVote != -1) {
    currentVote -= 1
  }
  return currentVote;
}