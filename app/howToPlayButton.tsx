import { ButtonWithModal } from './buttonWithModal';

export function HowToPlayButton() {
  return (
    <ButtonWithModal
      buttonText="How To Play"
      modalTitle="How To Play"
      modalContent={
        <>
          <p>Game Objective : Have the most discs of your color on board at the end.</p>
          <p>On your turn place a disc on the board so that your oponent's row, or rows, of discs is bordered at each end by your own color.</p>
          <p>Flip all the discs within the border</p>
          <p>Black Moves First</p>
          <p>If no move is possible on your turn it is skipped.</p>
        </>
      }
    ></ButtonWithModal>
  );
}
