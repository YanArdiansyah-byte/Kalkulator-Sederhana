document.addEventListener("DOMContentLoaded", function () {
  const calculator = {
    currentOperand: "0",
    previousOperand: "",
    operation: undefined,
    reset: false,
  };

  const currentOperandElement = document.getElementById("current-operand");
  const previousOperandElement = document.getElementById("previous-operand");
  const buttons = document.querySelectorAll("button");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;

      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  function updateDisplay() {
    currentOperandElement.innerText = calculator.currentOperand;
    if (calculator.operation) {
      previousOperandElement.innerText = `${
        calculator.previousOperand
      } ${getOperationSymbol(calculator.operation)}`;
    } else {
      previousOperandElement.innerText = "";
    }
  }

  function getOperationSymbol(operation) {
    switch (operation) {
      case "+":
        return "+";
      case "-":
        return "-";
      case "*":
        return "×";
      case "/":
        return "÷";
      case "power":
        return "^";
      case "sqrt":
        return "√";
      default:
        return "";
    }
  }

  function sqrtOperation() {
    if (calculator.currentOperand === "") return;
    calculator.operation = "sqrt";
    calculator.previousOperand = "";
    compute();
  }

  function appendNumber(number) {
    if (calculator.reset) {
      calculator.currentOperand = "";
      calculator.reset = false;
    }

    if (number === "." && calculator.currentOperand.includes(".")) return;

    if (calculator.currentOperand === "0" && number !== ".") {
      calculator.currentOperand = number;
    } else {
      calculator.currentOperand += number;
    }
  }

  function chooseOperation(operation) {
    if (calculator.currentOperand === "") return;

    if (calculator.previousOperand !== "") {
      compute();
    }

    calculator.operation = operation;
    calculator.previousOperand = calculator.currentOperand;
    calculator.currentOperand = "";
  }

  function compute() {
    let computation;
    const prev = parseFloat(calculator.previousOperand);
    const current = parseFloat(calculator.currentOperand);

    if (calculator.operation === "sqrt") {
      if (isNaN(current)) return;
      computation = Math.sqrt(current);
      calculator.previousOperand = "";
    } else {
        if (isNaN(prev) || isNaN(current)) return;

        switch (calculator.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            case 'power':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
    }

    calculator.currentOperand = computation.toString();
    calculator.operation = undefined;
    calculator.previousOperand = "";
    calculator.reset = true;
  }

  function clear() {
    calculator.currentOperand = "0";
    calculator.previousOperand = "";
    calculator.operation = undefined;
  }

  function deleteNumber() {
    if (calculator.currentOperand.length === 1) {
      calculator.currentOperand = "0";
    } else {
      calculator.currentOperand = calculator.currentOperand.slice(0, -1);
    }
  }

  function formatNumber(number) {
    const floatNumber = parseFloat(number);
    if (isNaN(floatNumber)) return "";
    return floatNumber.toLocaleString("en");
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.number) {
        appendNumber(button.dataset.number);
      } else if (button.dataset.operation) {
        if (button.dataset.operation === "equals") {
          compute();
        } else if (button.dataset.operation === "clear") {
          clear();
        } else if (button.dataset.operation === "delete") {
          deleteNumber();
        } else if (button.dataset.operation === "sqrt") {
          calculator.previousOperand = "";
          calculator.operation = "sqrt";
          compute();
        } else {
          chooseOperation(button.dataset.operation);
        }
      }

      updateDisplay();
    });
  });

  document.addEventListener("keydown", (e) => {
    if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
      appendNumber(e.key);
    } else if (
      e.key === "+" ||
      e.key === "-" ||
      e.key === "*" ||
      e.key === "/"
    ) {
      chooseOperation(e.key);
    } else if (e.key === "Enter" || e.key === "=") {
      compute();
    } else if (e.key === "Escape") {
      clear();
    } else if (e.key === "Backspace") {
      deleteNumber();
    } else if (e.key === "^") {
      chooseOperation("power");
    } else if (e.key === "s") {
      calculator.previousOperand = "";
      calculator.operation = "sqrt";
      compute();
    }

    updateDisplay();
  });

  updateDisplay();
});
