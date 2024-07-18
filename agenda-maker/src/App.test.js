import {render,fireEvent,waitFor,screen,queryAllByRole} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import App from './App';
const mockAgenda=[
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
];

const addNewData={
    title:"React",
    description:"Some description about the React",
    topics:["Introduction","Why React?","Type of Component"]
}
const addNewData1={
    title:"Java",
    description:"Some description about the java",
    topics:["Intro to java","Java Basics","OOP's concepts","Frameworks"]
}
const addNewData2={
    title:"Python",
    description:"Some description about the python",
    topics:["Intro to python","Python basics","Frameworks","Python in data science","why Python"]
}

test("should display initial UI",async()=>{
    render(<App />);
    await waitFor(()=>screen.queryByRole('addAgenda'))
    expect(screen.queryByRole('viewAgenda')).not.toBeInTheDocument();
    expect(screen.queryByRole('addAgenda')).toBeInTheDocument();
    expect(screen.queryByRole('addTopicBtn')).toBeDisabled();
    expect(screen.queryByRole('submitAgendaBtn')).toBeDisabled();
    expect(screen.queryByRole('noTopicsMsg')).toBeInTheDocument();  
});
const dispatchInput=(selector,value)=>{
    userEvent.type(screen.queryByRole(selector),value);
}

const getIdText=(l)=>{
    return screen.getByTestId(l).textContent.trim();
}

test('form validation - invalid',async()=>{
    render(<App />)
    dispatchInput("inputTitle"," ");
    expect(getIdText("invalidTitle")).toEqual("Title is required");
    dispatchInput("inputDescription"," ");
    expect(getIdText("invalidDescription")).toEqual("Description is required");
    dispatchInput("inputTopic","    ");
    expect(getIdText("invalidTopic")).toEqual("Topic is required");
    expect(screen.queryByRole('addTopicBtn')).toBeDisabled();
    expect(screen.queryByRole('submitAgendaBtn')).toBeDisabled();
});

test('form validation - valid add btn',async()=>{
    render(<App/>)
    dispatchInput("inputTitle"," ");
    expect(getIdText("invalidTitle")).toEqual("Title is required");
    dispatchInput("inputDescription"," ");
    expect(getIdText("invalidDescription")).toEqual("Description is required");
    dispatchInput("inputTopic","Introduction");
    expect(getIdText("invalidTopic")).toEqual("");
    expect(screen.queryByRole('addTopicBtn')).not.toBeDisabled();
    expect(screen.queryByRole('submitAgendaBtn')).toBeDisabled();

});

test('form validation - invalid submit',async()=>{
    render(<App/>)
    dispatchInput("inputTitle","React");
    expect(getIdText("invalidTitle")).toEqual("");
    dispatchInput("inputDescription","Some description");
    expect(getIdText("invalidDescription")).toEqual("");
    dispatchInput("inputTopic","Introduction");
    expect(getIdText("invalidTopic")).toEqual("");
    expect(screen.queryByRole('addTopicBtn')).not.toBeDisabled();
    expect(screen.queryByRole('submitAgendaBtn')).toBeDisabled();
});

test('form validation - valid submit',async()=>{
    render(<App/>)
    dispatchInput("inputTitle","React");
    expect(getIdText("invalidTitle")).toEqual("");
    dispatchInput("inputDescription","Some description");
    expect(getIdText("invalidDescription")).toEqual("");
    const inputE3=screen.queryByRole('inputTopic');
    addTopic(inputE3,"Introduction")
    expect(getIdText("invalidTopic")).toEqual("");
    expect(screen.queryByTestId('noTopicMsg')).not.toBeInTheDocument();
    expect(screen.queryByRole('addTopicBtn')).toBeDisabled();
    expect(screen.queryByRole('submitAgendaBtn')).not.toBeDisabled();
});

test('toggle view check',async()=>{
    render(<App/>)
    fireEvent.click(screen.queryByRole('goToView'));
    await waitFor(()=>screen.queryByRole('viewAgenda'))
    expect(screen.queryByRole('addAgenda')).not.toBeInTheDocument();
    expect(screen.queryByRole('viewAgenda')).toBeInTheDocument();
    fireEvent.click(screen.queryByRole('goToAdd'));
    await waitFor(()=>screen.queryByRole('addAgenda'))
    expect(screen.queryByRole('viewAgenda')).not.toBeInTheDocument();
    expect(screen.queryByRole('addAgenda')).toBeInTheDocument();
});

test('check form input',()=>{
    render(<App />)
    const inputE3=screen.queryByRole('inputTopic');
    addTopic(inputE3,"Introduction");
    let data=screen.queryAllByRole('topicList');
    expect(data[0].textContent).toEqual("Introduction");
    expect(inputE3).toHaveValue("");

    addTopic(inputE3,"Why React?");
    data=screen.queryAllByRole("topicList");
    expect(data[1].textContent).toEqual("Why React?");
    expect(inputE3).toHaveValue("");

    addTopic(inputE3,"Types of components");
    data=screen.queryAllByRole("topicList");
    expect(data[2].textContent).toEqual("Types of components");
    expect(inputE3).toHaveValue("");
});

const getText = (elem, selector) => {
    return elem.querySelector(selector).textContent.trim();
  };
  
  const getText2 = (elem) => {
    return elem.textContent.trim();
  };
  
  test('check view agenda', async () => {
    render(<App />);
    fireEvent.click(screen.queryByRole('goToView'));
    await waitFor(() => screen.queryByRole('viewAgenda'));
    const data = screen.queryAllByRole('cards');
  
    for (let i = 0; i < 2; i++) {
      expect(getText(data[i], '.card-header')).toEqual(mockAgenda[i].title);
      let lis = data[i].querySelectorAll('li');
  
      for (let j = 0; j < mockAgenda[i].topics.length; j++) {
        expect(getText2(lis[j])).toEqual(mockAgenda[i].topics[j]);
      }
  
      expect(getText(data[i], '.card-footer')).toEqual(mockAgenda[i].description);
    }
  });
  

const addTopic=(inputElm,value)=>{
    userEvent.type(inputElm,value);
    fireEvent.click(screen.queryByRole('addTopicBtn'))
}

test('add and view the agenda',async()=>{
    render(<App/>);
    const inputE1=screen.queryByRole('inputTitle');
    userEvent.type(inputE1,addNewData.title);
    const inputE2=screen.queryByRole('inputDescription');
    userEvent.type(inputE2,addNewData.description);
    const inputE3=screen.queryByRole('inputTopic');
    addTopic(inputE3,'Introduction');
    addTopic(inputE3,'Why React?');
    addTopic(inputE3,'Type of Component');
    fireEvent.click(screen.queryByRole('submitAgendaBtn'));
    fireEvent.click(screen.queryByRole('goToView'));
    await waitFor(()=>screen.queryAllByRole("viewAgenda"));
    const data=screen.queryAllByRole('cards');
    expect(getText(data[2],'.card-header')).toEqual(addNewData.title);
    let lis=data[2].querySelectorAll('li');
    for(let j=0;j<addNewData.topics.length;j++)
    expect(getText2(lis[j])).toEqual(addNewData.topics[j]);
    expect(getText(data[2],'.card-footer')).toEqual(addNewData.description);
});

test('add and view the agenda -2', async () => {
    render(<App />);
    const inputE1 = screen.queryByRole('inputTitle');
    const inputE2 = screen.queryByRole('inputDescription');
    const inputE3 = screen.queryByRole('inputTopic');
  
    userEvent.type(inputE1, addNewData1.title);
    userEvent.type(inputE2, addNewData1.description);
    for (let t1 = 0; t1 < addNewData1.topics.length; t1++) {
      addTopic(inputE3, addNewData1.topics[t1]);
    }
    fireEvent.click(screen.queryByRole('submitAgendaBtn'));
  
    userEvent.type(inputE1, addNewData2.title);
    userEvent.type(inputE2, addNewData2.description);
    for (let t2 = 0; t2 < addNewData2.topics.length; t2++) {
      addTopic(inputE3, addNewData2.topics[t2]);
    }
    fireEvent.click(screen.queryByRole('submitAgendaBtn'));
  
    fireEvent.click(screen.queryByRole('goToView'));
    await waitFor(() => screen.queryByRole('viewAgenda'));
    let data = screen.queryAllByRole('cards');
    let lis1 = data[2].querySelectorAll('li');
  
    expect(getText(data[2], '.card-header')).toEqual(addNewData1.title);
    for (let j = 0; j < addNewData1.topics.length; j++) {
      expect(getText2(lis1[j])).toEqual(addNewData1.topics[j]);
    }
    expect(getText(data[2], '.card-footer')).toEqual(addNewData1.description);
  
    let lis2 = data[3].querySelectorAll('li');
    expect(getText(data[3], '.card-header')).toEqual(addNewData2.title);
    for (let j = 0; j < addNewData2.topics.length; j++) {
      expect(getText2(lis2[j])).toEqual(addNewData2.topics[j]);
    }
    expect(getText(data[3], '.card-footer')).toEqual(addNewData2.description);
  });
  