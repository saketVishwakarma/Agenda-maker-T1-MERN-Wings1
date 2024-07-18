import React, { useState } from 'react';
import './App.css';

function App() {
  const [agenda, setAgenda] = useState([
    {
      title:"Angular",
      description:"Some description about the angular",
      topics:["Introduction","typeScript","Why Angular?","Understanding version","Fundamentals"]
  },
  {
      title:"Vue",
      description:"Some description about the Vue",
      topics:["Introduction","javaScript","Why Vue?","Vue Bindings","Component Introduction"]
  },
  ]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState([]);
  const [newtopic, setNewTopic] = useState("");
  const [showDialog, setShowDialog] = useState(true);
  const [Tmsg, setTmsg] = useState(false);
  const [Dmsg, setDmsg] = useState(false);
  const [Tomsg, setTomsg] = useState(false);
  const [topicBtn, setTopicBtn] = useState(true);
  const [agendaBtn, setAgendaBtn] = useState(true);


  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'newTitle') {
      setTitle(value);
      setAgendaBtn(false);
      setTmsg(value.trim() === ''); 
    } else if (name === 'newDescription') {
      setDescription(value);
      setAgendaBtn(false);
      setDmsg(value.trim() === ''); 
    } else if (name === 'newTopic') {
      setNewTopic(value);
      setTomsg(value.trim() === ''); 
  
      // Adjusted logic here to check if the topic is valid
      if (value.trim() !== '') {
        setTopicBtn(false);
        setAgendaBtn(true)
      } else {
        setTopicBtn(true);
      }
  
      if (topic.length > 0) {
        setAgendaBtn(false);
      }
    }
    if(!Tomsg||!Tmsg){
      setAgendaBtn(true)
    }
  };
  
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  
  //   if (name === 'newTitle') {
  //     setTitle(value);
  //     setAgendaBtn(true);
  //     setTmsg(value.trim() === ''); 
  //   } else if (name === 'newDescription') {
  //     setDescription(value);
  //     setAgendaBtn(true);
  //     setDmsg(value.trim() === ''); 
  //   } else if (name === 'newTopic') {
  //     setNewTopic(value);
  //     setTomsg(value.trim() === ''); // Updated to setTomsg instead of setAgendaBtn
  //     setTopicBtn(value.trim() === ''); // Updated to setTopicBtn based on topic input
  
  //     if (topic.length > 0) {
  //       setAgendaBtn(true);
  //       setTopicBtn(true)
  //     }
  //   }
  // };
  
  const handleTopic = (e) => {
    e.preventDefault();
  
    if (newtopic.trim() !== "" || topic.length > 0) {  // Updated to check topic.length > 0
      setTopic((prevArray) => [...prevArray, newtopic.trim()]);
      setNewTopic('');
      setTopicBtn(true)
      setAgendaBtn(false)
    } else {
      setTomsg(true);
    }
  
    if (topic.length > 0) {
      setAgendaBtn(false);
      
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (title.trim() === "") {
      setTmsg(true);
    }
    if (description.trim() === "") {
      setDmsg(true);
    }
    if (topic.length === 0) {
      setTomsg(true);
      setAgendaBtn(false);
      setTopicBtn(true)
    } else {
      setAgendaBtn(false);
      setTopicBtn(true)
    }
  
    const temp = {
      title,
      description,
      topics: topic,
    };
  
    setAgenda([...agenda, temp]);
  
    // Clear form fields and topics after successful submission
    setTitle("");
    setDescription("");
    setTopic([]);
  };
  


  return (
    <div>
      <h1 className='mx-5 mb-5'>Agenda Maker</h1>
      {showDialog ? (
        <div className='container' role='addAgenda'>
          <button className='btn btn-info' role="goToView" onClick={() => setShowDialog(false)}>
            Click To View Agenda
          </button>
          <form>
            <div className='my-3'>
              <label className='form-label'>Title</label>
              <input type="text" name='newTitle' placeholder='Enter the title' className='form-control' role='inputTitle' onChange={handleChange}  value={title}/>
              {Tmsg ? <small className='text-danger' data-testid="invalidTitle">Title is required</small> :<small className='text-danger' data-testid="invalidTitle"></small>}
            </div>

            <div className='my-3'>
              <label className='form-label'>Description</label>
              <input type="text" name='newDescription' placeholder='Enter the Description' className='form-control' role='inputDescription' onChange={handleChange} value={description} />
              {Dmsg ? <small className='text-danger' data-testid="invalidDescription">Description is required</small> :<small className='text-danger' data-testid="invalidDescription"></small>}
            </div>

            <div className='my-3 w-50'>
              <label className='form-label'>Enter Topic</label>
              <input type="text" name='newTopic' placeholder='Enter the TOPIC' className='form-control' role='inputTopic' onChange={handleChange} value={newtopic} />
              {Tomsg ? <small className='text-danger' data-testid="invalidTopic">Topic is required</small> :<small className='text-danger' data-testid="invalidTopic"></small>}
            </div>

            <button className='btn btn-success addAlign' role='addTopicBtn' onClick={handleTopic} disabled={topicBtn}>
              +Add Topic
            </button>

            <button className='btn btn-success submitAlign' role='submitAgendaBtn' onClick={handleSubmit} disabled={agendaBtn}>
              Submit Agenda
            </button>
          </form>

          {topic.length === 0 ? (
            <div className='text-danger ml-2 mt-5' data-testid="noTopicsMsg" role='noTopicsMsg'>
              No Topics Added
            </div>
          ) : (
            <div className='card my-3'>
              <div className='card-header'>Added Topics</div>
              <div className='card-body'>
                <ul className='list-group'>
                  {topic.map((elem, index) => (
                    <li key={index} className='list-group-item' role='topicList'>
                      {elem}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='card-footer'>Refer the topics you added</div>
            </div>
          )}
        </div>
      ) : (
        <div className='container' role='viewAgenda'>
          <button className='btn btn-info' role='goToAdd' onClick={() => setShowDialog(true)}>
            Click To Add Agenda
          </button>
          <div>
            {agenda.map((i, index) => (
              <div key={index} className='card my-3' role='cards'>
                <div className='card-header'>{i.title}</div>
                <div className='card-body'>
                  <ul className='list-group'>
                    {i.topics.map((elem, subIndex) => (
                      <li key={subIndex} className='list-group-item' role='topicList'>
                        {elem}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='card-footer'>{i.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
