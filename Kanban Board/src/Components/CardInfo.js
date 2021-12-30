import React, { useEffect, useState } from "react";
import {
  Calendar,
  CheckSquare,
  List,
  Tag,
  Trash,
  Type,
  X,
} from "react-feather";
import Modal from "./Modal";
import Editable from "./Editable";

function CardInfo(props) {
  // array of colors to printed on edit screen
  const colors = [
    "#a8193d",
    "#4fcc25",
    "#1ebffa",
    "#8da377",
    "#9975bd",
    "#cf61a1",
    "#240959",
  ];

  // state variable to keep track of selected color
  const [selectedColor, setSelectedColor] = useState();
  // card data passed from props
  const [values, setValues] = useState({
    ...props.card,
  });

  // when user updates title, it will update the title in state data
  const updateTitle = (value) => {
    setValues({ ...values, title: value });
  };

  // when user updates description, it will update the title in state data
  const updateDesc = (value) => {
    setValues({ ...values, desc: value });
  };

  // this will be called when a new label is added
  const addLabel = (label) => {
    // it will find the index of label by its text
    const index = values.labels.findIndex((item) => item.text === label.text);
    // return if not found
    if (index > -1) return;

    // set selected color to none
    setSelectedColor("");
    // set state data 
    setValues({
      ...values,
      labels: [...values.labels, label],
    });
  };

  // remove a label
  const removeLabel = (label) => {
    // get the labels expect the one to remove
    const tempLabels = values.labels.filter((item) => item.text !== label.text);

    // set it in the state
    setValues({
      ...values,
      labels: tempLabels,
    });
  };

  // function to add new task
  const addTask = (value) => {
    // task object
    const task = {
      id: Date.now() + Math.random() * 2,
      completed: false,
      text: value,
    };
    // save it in state variable
    setValues({
      ...values,
      tasks: [...values.tasks, task],
    });
  };

  // function to remove a task
  const removeTask = (id) => {
    const tasks = [...values.tasks];

    // get the tasks except the one to remove
    const tempTasks = tasks.filter((item) => item.id !== id);
    // save it in state variable
    setValues({
      ...values,
      tasks: tempTasks,
    });
  };

  // function to update a task
  const updateTask = (id, value) => {
    const tasks = [...values.tasks];

    // get the index of the task to be updated
    const index = tasks.findIndex((item) => item.id === id);
    // return if not found
    if (index < 0) return;

    // set the completed status
    tasks[index].completed = value;

    // save it in state variable
    setValues({
      ...values,
      tasks,
    });
  };

  // function to calculate the % of completion of tasks
  const calculatePercent = () => {
    if (!values.tasks?.length) return 0;
    const completed = values.tasks?.filter((item) => item.completed)?.length;
    return (completed / values.tasks?.length) * 100;
  };

  // function to update date on a task
  const updateDate = (date) => {
    if (!date) return;

    // save it in state variable
    setValues({
      ...values,
      date,
    });
  };

  // on useEffect
  // set all the data to the parents array
  useEffect(() => {
    if (props.updateCard) props.updateCard(props.boardId, values.id, values);
  }, [values]);

  return (
    <Modal onClose={props.onClose}>
      <div className="cardinfo">
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Type />
            <p>Title</p>
          </div>
          {/* card title editable */}
          <Editable
            defaultValue={values.title}
            text={values.title}
            placeholder="Enter Title"
            onSubmit={updateTitle}
          />
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <List />
            <p>Description</p>
          </div>
          {/* card destiption editable */}
          <Editable
            defaultValue={values.desc}
            text={values.desc || "Add a Description"}
            placeholder="Enter description"
            onSubmit={updateDesc}
          />
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Calendar />
            <p>Date</p>
          </div>
          <input
            type="date"
            defaultValue={values.date}
            min={new Date().toISOString().substr(0, 10)}
            onChange={(event) => updateDate(event.target.value)}
          />
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Tag />
            <p>Labels</p>
          </div>
          <div className="cardinfo_box_labels">
            {/* rendering labels */}
            {values.labels?.map((item, index) => (
              <label
                key={index}
                style={{ backgroundColor: item.color, color: "#fff" }}
              >
                {item.text}
                {/* delete button on a label */}
                <X onClick={() => removeLabel(item)} />
              </label>
            ))}
          </div>
          <ul>
            {/* rendering available colors for new labels */}
            {colors.map((item, index) => (
              <li
                key={index + item}
                style={{ backgroundColor: item }}
                className={selectedColor === item ? "li_active" : ""}
                onClick={() => setSelectedColor(item)}
              />
            ))}
          </ul>
          {/* editable textbox for label name */}
          <Editable
            text="Add Label"
            placeholder="Enter label text"
            onSubmit={(value) =>
              addLabel({ color: selectedColor, text: value })
            }
          />
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <CheckSquare />
            <p>Tasks</p>
          </div>
          {/* progress bar with % of completion of tasks */}
          <div className="cardinfo_box_progress-bar">
            <div
              className="cardinfo_box_progress"
              style={{
                width: `${calculatePercent()}%`,
                backgroundColor: calculatePercent() === 100 ? "limegreen" : "",
              }}
            />
          </div>
          <div className="cardinfo_box_task_list">
            {/* rendering all the tasks inside a card */}
            {values.tasks?.map((item) => (
              <div key={item.id} className="cardinfo_box_task_checkbox">
                <input
                  type="checkbox"
                  defaultChecked={item.completed}
                  onChange={(event) =>
                    updateTask(item.id, event.target.checked)
                  }
                />
                <p className={item.completed ? "completed" : ""}>{item.text}</p>
                {/* delete button in each task */}
                <Trash onClick={() => removeTask(item.id)} />
              </div>
            ))}
          </div>
          {/* button to add new task */}
          <Editable
            text={"Add a Task"}
            placeholder="Enter task"
            onSubmit={addTask}
          />
        </div>
      </div>
    </Modal>
  );
}

export default CardInfo;
