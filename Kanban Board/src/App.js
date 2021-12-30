import React, { useEffect, useState } from "react";
import Board from "./Components/Board";
import Editable from "./Components/Editable";
import "./App.css";

function App() {
  // state variable to get list of all the tasks
  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem("kanban-store")) || []
  );

  // state variable to keep track of selected board and card
  // this will be used in dragging/dropping a card in a board
  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });

  // handler to be called when user adds a new board
  // it will take board name as input
  const addboardHandler = (name) => {
    // get boards from state
    const tempBoards = [...boards];
    // push new board in the array
    tempBoards.push({
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
    });
    // set new boards array in state
    setBoards(tempBoards);
  };

  // remove board
  // it will take ID of the board as input
  const removeBoard = (id) => {
    // find the board by ID from boards array
    const index = boards.findIndex((item) => item.id === id);
    // if not found, just return
    if (index < 0) return;

    // create local array from the boards array
    const tempBoards = [...boards];
    // remove the item that was found on this index
    tempBoards.splice(index, 1);
    // set the baords array back in the state
    setBoards(tempBoards);
  };

  // this function will add a new card in a board
  // it will take board ID and card title as input
  const addCardHandler = (id, title) => {
    // find the index of the board
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    // create temporary array from boards array in state
    const tempBoards = [...boards];
    // find the board at found index and push new card object
    tempBoards[index].cards.push({
      id: Date.now() + Math.random() * 2,
      title,
      labels: [],
      date: "",
      tasks: [],
    });
    // set the boards array back in state
    setBoards(tempBoards);
  };

  // function to remove a card from a board
  // it will take card ID and board ID as input
  const removeCard = (bid, cid) => {
    // find the board from boards array
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    // create a local variable for boards array
    const tempBoards = [...boards];
    // get cards in this board
    const cards = tempBoards[index].cards;

    // find the index of the card which you want to delete
    const cardIndex = cards.findIndex((item) => item.id === cid);
    // return if not found
    if (cardIndex < 0) return;

    // remove the item on found index
    cards.splice(cardIndex, 1);
    // set boards array back in state
    setBoards(tempBoards);
  };

  // this function is called when user stops dragging a card in a board
  // it will get board ID and card ID
  const dragEnded = (bid, cid) => {
    // create temporary variables
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    // find the board with ID given to function
    s_boardIndex = boards.findIndex((item) => item.id === bid);
    // return if not found
    if (s_boardIndex < 0) return;

    // find the index of the card in this board
    s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => item.id === cid
    );
    // return if not found
    if (s_cardIndex < 0) return;

    // get the index of target board, this is the board where card is moving to
    t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
    // return if not found
    if (t_boardIndex < 0) return;

    // get the index of card in this board
    t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cid
    );
    // return if not found
    if (t_cardIndex < 0) return;

    // create temporary array for boards
    const tempBoards = [...boards];
    // get the source card
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    // remove this card from source board
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    // add it in the destination board
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    // set the boards array into the state
    setBoards(tempBoards);

    // reset the target card
    setTargetCard({
      bid: "",
      cid: "",
    });
  };

  // this function is called when user starts dragging a card in a board
  // it will get board ID and card ID
  const dragEntered = (bid, cid) => {
    // if the user place the card on same place again
    // then return, do nothing
    if (targetCard.cid === cid) return;

    // otherwise,
    // get set the state variable to keep track of the desination board and card
    setTargetCard({
      bid,
      cid,
    });
  };

  // this function will be called when you want to update a card
  // it will get the board ID, card ID and card object (data) as input
  const updateCard = (bid, cid, card) => {
    // find the board from state array
    const index = boards.findIndex((item) => item.id === bid);
    // return if not found
    if (index < 0) return;

    // create a local variable for boards array
    const tempBoards = [...boards];
    // get the cards array out of it
    const cards = tempBoards[index].cards;

    // find the card index with provided ID
    const cardIndex = cards.findIndex((item) => item.id === cid);
    // return if not found
    if (cardIndex < 0) return;

    // replace the card data on the found index
    tempBoards[index].cards[cardIndex] = card;

    // save the array back in the state
    setBoards(tempBoards);
  };

  // useEffect will be automatically called whenever the boards array changes
  // so whenever it changes, this method will save it back in browsers local storage
  useEffect(() => {
    localStorage.setItem("kanban-store", JSON.stringify(boards));
  }, [boards]);

  return (
    <div className="app">
      <div className="app_nav">
      {/* navbar */}
        <h1>Kanban Board</h1> 
      </div>
      <div className="app_boards_container">
        <div className="app_boards">
          {/* looping through all boards in the array and rendering the Board component for each */}
          {boards.map((item) => (
            <Board
              key={item.id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item.id)}
              removeCard={removeCard}
              dragEnded={dragEnded}
              dragEntered={dragEntered}
              updateCard={updateCard}
            />
          ))}
          <div className="app_boards_last">
            {/* component to add new board */}
            <Editable
              displayClass="app_boards_add-board"
              editClass="app_boards_add-board_edit"
              placeholder="Enter Board Name"
              text="Add Board"
              buttonText="Add Board"
              onSubmit={addboardHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
