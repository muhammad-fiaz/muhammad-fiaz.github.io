import { type JSX, Show, createSignal } from "solid-js";

type Props = {
  children: JSX.Element;
  class?: string;
};

function Tooltip(props: Props) {
  const [isVisible, setIsVisible] = createSignal(false);
  const [clickCount, setClickCount] = createSignal(0);

  const messages = [
    "Hi there! 👋",
    "Clicked again? 🤨",
    "Still here? 🧐",
    "Persistent, aren't you? 💪",
    "What's up? 😄",
    "Again? Really? 😅",
    "You're curious! 🤓",
    "Not cool! 😑",
    "Give it a break! 😬",
    "That's annoying! 😠",
    "Hands off! ✋",
    "No more clicks! 🚫",
    "Seriously?! 🤯",
    "Ouch! That hurts! 💥",
    "You're persistent! 🔁",
    "Why the curiosity? 🤔",
    "I'm getting tired! 😴",
    "I'm bored! 😐",
    "Enough's enough! 😤",
    "Find another hobby! 🏓",
    "Stop, please! 🙏",
    "Okay, last one! 🎯",
    "That's it, I'm done! 🛑",
  ];

  const currentMessage = () => messages[Math.min(clickCount(), messages.length - 1)];

  const toggleTooltip = () => {
    const visible = isVisible();
    setIsVisible(!visible);
    if (!visible) {
      setClickCount((prev) => prev + 1);
    }
  };

  return (
      <div class={`relative inline-block ${props.class || ""}`}>
        <div
            onMouseDown={toggleTooltip}
            onMouseUp={() => setIsVisible(false)}
            onTouchStart={toggleTooltip}
            onTouchEnd={() => setIsVisible(false)}
            class="cursor-pointer"
        >
          {props.children}
        </div>

        <Show when={isVisible()}>
          <div
              role="tooltip"
              aria-live="polite"
              class="absolute left-1/2 -translate-x-1/2 -translate-y-24 mt-1 w-auto max-h-[70px] p-2 bg-black text-white text-center rounded-lg z-10 shadow-custom shadow-primary-500 border border-primary-500 whitespace-normal after:content-[''] after:block after:rotate-45 after:w-4 after:h-4 after:shadow-custom after:shadow-primary-500 after:absolute after:-bottom-2 after:-translate-x-1/2 after:left-1/2 after:bg-black after:z-20"
          >
            <p class="w-max">{currentMessage()}</p>
          </div>
        </Show>
      </div>
  );
}

export default Tooltip;
