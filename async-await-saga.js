const { createStore, applyMiddleware } = window.Redux;
const createSagaMiddleware = window.ReduxSaga.default;
const { takeLatest, call, put } = window.ReduxSaga.effects;

/* Reducer & Actions */
const initialState = { name: "", age: null, isLoading: false };
function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case "GET_PERSON_START":
      return { ...state, isLoading: true };
    case "GET_PERSON_SUCCESS":
      return { name: payload.name, age: payload.age, isLoading: false };
    default:
      return state;
  }
}
function getPeronStart() {
  return { type: "GET_PERSON_START" };
}
function getPersonSuccess(person) {
  return {
    type: "GET_PERSON_SUCCESS",
    payload: {
      age: person.dob.age,
      name: `${person.name.first} ${person.name.last}`
    }
  };
}

/* Sagas */
function* getPersonSaga(action) {
  try {
    const { results } = yield call(getPersonApi);
    yield put(getPersonSuccess(results[0]));
  } catch (e) {
    console.error("Oh no!");
  }
}
function* personWatcher() {
  yield takeLatest("GET_PERSON_START", getPersonSaga);
}

/* API */
async function getPersonApi() {
  const response = await fetch("https://randomuser.me/api/");
  return await response.json();
}

/* Redux bootstrapping */
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(personWatcher);

/* App */
function handleGetPerson() {
  store.dispatch(getPeronStart());
}
store.subscribe(function(a, b, c) {
  const { name, age, isLoading } = store.getState();

  const nameElement = document.querySelector('#name')
  const ageElement = document.querySelector('#age')
  const loadingElement = document.querySelector('#loading')

  nameElement.innerText = name;
  ageElement.innerText = age;
  loadingElement.style.visibility = isLoading ? 'visible' : 'hidden';
})
