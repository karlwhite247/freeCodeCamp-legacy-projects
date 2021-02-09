$(document).ready(function () {
  var input = ""; //holds value of the button pressed
  var result = "0"; //field where the input is printed out
  var history = "0"; //field showing the chain of arithmetic operation
  var answer = ""; //holds answer of the arithmetic operation when "=" pressed
  var MAX_LENGTH = 9; //max digits allowed in input screen
  var MAX_LENGTH_HISTORY = 21; //max digits allowed in history screen

  //click event adding chars to input field
  $("button").click(function () {
    //value of button pressed
    input = $(this).attr("value");

    checkHistory(); //check if limit reached prev step

    //check if max reached
    if (result.length <= MAX_LENGTH) {
      //digit
      if (!isNaN(input)) {
        if (answer === "") {
          isDigit(input);
        } else if (!isNaN(answer)) {
          var curr_input = input;
          reset_all();
          setResult(curr_input);
          setHistory(curr_input);
        }

        //dot
      } else if (input === ".") {
        //is dot already in result?
        checkDotExists();

        //sign
      } else if (
        input === "/" ||
        input === "*" ||
        input === "+" ||
        input === "-"
      ) {
        if (checkZeroResult() && history === "0") {
          //avoids sign to be the first input in chain

          if (input === "-" || input === "+") {
            setResult(input);
            setHistory(input);
          } else if (input === "/") {
            setResult(input);
            concHistory(input);
          }

          return;
        }

        if (answer === "") {
          // check if sign already in result
          if (!checkSign()) {
            concHistory(input);
            setResult(input);
          } else if (
            input === "-" &&
            (history.slice(-1) === "/" || history.slice(-1) === "*")
          ) {
            concHistory(input);
            setResult(input);
          }
        } else if (!isNaN(answer)) {
          //
          setHistory(answer + input);
          setResult(input);
          answer = "";
        }

        //equal sign
      } else if (input === "=") {
        try {
          //answer = eval(history);
          answer = Math.round(eval(history) * 100) / 100;

          //check if answer exceeds the screen limits
          if (
            answer.toString().length > MAX_LENGTH ||
            (history + "=" + answer).length > MAX_LENGTH_HISTORY
          ) {
            limitReached();
            return;
          }
          setResult(answer + "");
          concHistory("=" + answer);
        } catch (err) {
          console.log(err.message + ": " + "Incomplete arithmetic operation.");
        }

        //ac - reset all
      } else if (input === "ac") {
        reset_all();

        //ce - reset last input
      } else if (input === "ce") {
        if (answer !== "") {
          reset_all();
        } else {
          if (history.length - result.length !== 0) {
            history = history.substring(0, history.length - result.length);
          } else {
            history = "0";
          }

          setHistory(history);
          setResult("0");
        }
      }
    } else {
      limitReached();
    }
  });

  //helper functions

  //resets all fields if limit reached
  function limitReached() {
    result = "0";
    history = "LIMIT REACHED";
    answer = "";
    setResult(result);
    setHistory(history);
  }

  //process if digit is clicked
  function isDigit(newDigit) {
    if (checkZeroResult()) {
      setResult(newDigit);

      if (history !== "0") {
        concHistory(newDigit);
      } else {
        setHistory(newDigit);
      }
    } else if (checkSign()) {
      setResult(newDigit);
      concHistory(newDigit);
    } else {
      concResult(newDigit);
      concHistory(newDigit);
    }
  }

  //check if result field only have a operation sign
  function checkSign() {
    return (
      result.length === 1 &&
      (result === "/" || result === "*" || result === "+" || result === "-")
    );
  }

  //check if last character of history is a sign
  function checkSignHistory() {
    var lastChar = history.charAt(history.length - 1);
    return (
      lastChar === "/" ||
      lastChar === "*" ||
      lastChar === "+" ||
      lastChar === "-"
    );
  }

  //check if result field only contains "0"
  function checkZeroResult() {
    return result.length === 1 && result.charAt(0) === "0";
  }

  function checkHistory() {
    if (history === "LIMIT REACHED") {
      setHistory("0");
    }
  }

  //check if dot was already inserted
  function checkDotExists() {
    //looks for dot in result
    //yes does nothing & exit
    //no adds result and history & exit
    if (result.indexOf(".") < 0) {
      concResult(input);
      concHistory(input);
    }
  }

  //concatenates the new input to history field
  function concHistory(newInput) {
    history += newInput;
    setHistory(history);
  }

  //concatenates the new input to result field
  function concResult(newInput) {
    result += newInput;
    setResult(result);
  }

  //reset all fields - AC button
  function reset_all() {
    input = "";
    result = "0";
    history = "0";
    answer = "";
    setResult("0");
    setHistory("0");
  }

  function setResult(newResult) {
    result = newResult;
    $(".result > p").text(newResult);
  }

  function setHistory(newHistory) {
    history = newHistory;
    $(".history > p").text(newHistory);
  }
});