import { createSignal } from "solid-js";

export default () => {
  const [count, setCount] = createSignal(0, { equals: false });
  return (
    <>
      <button
        onClick={() =>
          setCount((current) => (current > 0 ? current - 1 : current))
        }
      >
        -
      </button>
      <input
        type="text"
        value={count()}
        readOnly
        style={{ "text-align": "center" }}
      />
      <button onClick={() => setCount((current) => current + 1)}>+</button>
    </>
  );
};
