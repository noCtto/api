export default function voteState(currentVote: number, newVote: any): number {
  console.log('votes.methods.voteState', currentVote, newVote);

  if(newVote && currentVote != 1) {
    currentVote += 1
  }

  if(!newVote && currentVote != -1) {
    currentVote -= 1
  }
  
  return currentVote;
}