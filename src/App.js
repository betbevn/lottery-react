import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import web3 from "./web3";
import Lottery from "./lottery";

const App = () => {
  const [manager, setManager] = useState();
  const [playsers, setPlayers] = useState([]);
  const [balance, setBalance] = useState();
  const [value, setValue] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    async function callContract() {
      const m = await Lottery.methods.manager().call();
      const p = await Lottery.methods.getPlayers().call();
      const b = await web3.eth.getBalance(Lottery.options.address);
      setManager(m);
      setPlayers(p);
      setBalance(b);
    }
    callContract();
  }, []);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const accounts = await web3.eth.getAccounts();

      setMessage("Waiting on transaction success...");

      await Lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });

      setMessage("You have been entered!");
    },
    [value]
  );

  const pickWinner = useCallback(async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await Lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("A winner has been picked!");
  }, []);

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}. There are currently{" "}
        {playsers.length} people entered, competing to win{" "}
        {balance ? web3.utils.fromWei(String(balance), "ether") : ""} ether!
      </p>

      <hr />

      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input value={value} onChange={(e) => setValue(e.target.value)} />
          <button>Enter</button>
        </div>
      </form>

      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={pickWinner}>Pick a winner!</button>

      <hr />

      {message}
    </div>
  );
};
export default App;
