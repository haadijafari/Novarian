import { JSX, useEffect, useRef, useState, RefObject, SetStateAction, Dispatch, ReactNode } from "react";

function useOutsideAlerter(
  ref: RefObject<HTMLElement | null>,
  setX: Dispatch<SetStateAction<boolean>>
): void {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     * Also closes the dropdown on "Escape" key press.
     **/
    function handleEvent(event: MouseEvent | KeyboardEvent) {
      // Handle outside click
      if (
        event instanceof MouseEvent &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setX(false);
      }
      // Handle Escape key press
      if (
        event instanceof KeyboardEvent &&
        event.key === "Escape" &&
        ref.current
      ) {
        setX(false);
      }
    }

    // Bind the event listeners
    document.addEventListener("mousedown", handleEvent);
    document.addEventListener("keydown", handleEvent);

    return () => {
      // Unbind the event listeners on clean up
      document.removeEventListener("mousedown", handleEvent);
      document.removeEventListener("keydown", handleEvent);
    };
  }, [ref, setX]);
}

type Props = {
  button: JSX.Element;
  children: ReactNode;
  classNames: string;
  animation?: string;
};

const Dropdown = ({ button, children, classNames, animation }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [openWrapper, setOpenWrapper] = useState<boolean>(false);
  useOutsideAlerter(wrapperRef, setOpenWrapper);

  const handleToggle = () => {
    setOpenWrapper((prev) => !prev);
  };

  return (
    <div ref={wrapperRef} className="relative flex">
      {/* The button is now a proper button element for better a11y */}
      <button
        className="flex"
        onMouseDown={handleToggle}
        aria-haspopup="true"
        aria-expanded={openWrapper}
      >
        {button}
      </button>
      <div
        className={`${classNames} absolute z-10 ${animation
          ? animation
          : "origin-top-right transition-all duration-300 ease-in-out"
          } ${openWrapper ? "scale-100" : "scale-0"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
