// element selcetors
const matchesContainer = document.querySelector(".all-matches");
const addMatchBtn = document.querySelector(".lws-addMatch");
const resetBtn = document.querySelector(".lws-reset");
let allMatchList = document.querySelectorAll(".match");

// action identifiers
const RESET = "reset";
const NEWSTATE = "new state";
const INCEREMENT = "increment";
const DECREMENT = "decrement";

// initial state
const initialState = [
  {
    id: 1,
    total: 0,
  },
];

// reducer
const matchReducer = (state = initialState, action) => {
  if (action.type === NEWSTATE) {
    return [
      ...state,
      {
        id: action.payload.id,
        total: 0,
      },
    ];
  } else if (action.type === RESET) {
    return state.map((matchState) => {
      return {
        ...matchState,
        total: 0,
      };
    });
  } else if (action.type === INCEREMENT) {
    return state.map((matchState) => {
      if (matchState.id === action.payload.id) {
        return {
          ...matchState,
          total: matchState.total + action.payload.value,
        };
      } else {
        return matchState;
      }
    });
  } else if (action.type === DECREMENT) {
    return state.map((matchState) => {
      if (matchState.id === action.payload.id) {
        return {
          ...matchState,
          total:
            matchState.total - action.payload.value < 0
              ? 0
              : matchState.total - action.payload.value,
        };
      } else {
        return matchState;
      }
    });
  } else {
    return state;
  }
};

// create redux store
const store = Redux.createStore(matchReducer);

// // functions
const createMatch = (matchNumber) => {
  const divMatch = document.createElement("div");
  divMatch.classList.add("match");

  divMatch.innerHTML = `<div class="wrapper">
  <button class="lws-delete">
      <img src="./image/delete.svg" alt="" />
  </button>
  <h3 class="lws-matchName">Match ${matchNumber}</h3>
</div>
<div class="inc-dec">
  <form class="incrementForm">
      <h4>Increment</h4>
      <input
          type="number"
          name="increment"
          class="lws-increment"
      />
  </form>
  <form class="decrementForm">
      <h4>Decrement</h4>
      <input
          type="number"
          name="decrement"
          class="lws-decrement"
      />
  </form>
</div>
<div class="numbers">
  <h2 class="lws-singleResult">0</h2>
</div>`;

  return divMatch;
};

const addListener = (element, id, type) => {
  const formElement = element;
  const inputElement = element.children[1];

  formElement.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  inputElement.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      store.dispatch({
        type: type,
        payload: {
          id,
          value: Number(e.target.value),
        },
      });
      inputElement.value = "";
    }
  });
};

const setEventListenersInMatch = (match, id) => {
  addListener(match.children[1].children[0], id, INCEREMENT);
  addListener(match.children[1].children[1], id, DECREMENT);
};

const updateUI = (match, serial) => {
  const state = store.getState();
  match.children[2].innerText = state[serial].total.toString();
};

// connect all matches to redux store
const connectInStore = (serial) => {
  const currentMatch = allMatchList[serial];
  setEventListenersInMatch(currentMatch, serial + 1);
  store.subscribe(() => updateUI(currentMatch, serial));
};

// add/reset event listeners
addMatchBtn.addEventListener("click", () => {
  matchesContainer.appendChild(createMatch(allMatchList.length + 1));
  allMatchList = document.querySelectorAll(".match");

  store.dispatch({
    type: NEWSTATE,
    payload: {
      id: allMatchList.length,
    },
  });
  connectInStore(allMatchList.length - 1);
});

resetBtn.addEventListener("click", () => {
  store.dispatch({
    type: RESET,
  });
});

// initialization for first match
connectInStore(0);
updateUI(document.querySelector(".match"), 0);
