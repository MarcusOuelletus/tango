token = ""

async function getToken() {
  response = await fetch("https://interview.tangohq.com/welcome", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  data = await response.json();
  return data.token
}

async function challenge1() {
  left = 0
  right = 100_000_000

  async function guessNumber(v) {
    response = await fetch("https://interview.tangohq.com/guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ "myGuess": v }),
    })

    data = await response.json();

    if (data.status == "higher") {
      console.log(`too low ${v}`);
      left = v;
    } else if (data.status == "lower") {
      console.log(`too high ${v}`);
      right = v;
    } else {
      console.log(v);
      console.log(data);
      return
    }

    if (left > right) {
      return;
    }

    await guessNumber(Math.round((left + right) / 2));
  }

  response = await fetch("https://interview.tangohq.com/start", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  console.log(await response.json())

  await guessNumber(Math.round((left + right) / 2));
}

async function challenge2() {

  async function getWordlePositions(letters, answer) {
    response = await fetch("https://interview.tangohq.com/guess-word", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ "myGuess": letters }),
    })

    data = await response.json();

    for (let i = 0; i < data.hint.positionAndCharacter.length; i++) {
      const element = data.hint.positionAndCharacter[i];
      if (element) {
        answer = answer.substring(0, i) + letters[0] + answer.substring(i + 1)
      }
    }

    return answer
  }

  async function getWordleAnswer() {
    response = await fetch("https://interview.tangohq.com/guess-word", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ "myGuess": "abcdefghijklmnopqrstuvwxyz" }),
    })

    data = await response.json();

    console.log(data);

    letters = "";
    answer = "";

    for (let i = 0; i < data.hint.character.length; i++) {
      const element = data.hint.character[i];
      if (element) letters += String.fromCharCode(97 + i);
    }

    for (let j = 0; j < data.hint.positionAndCharacter.length; j++) {
      answer += letters[0];
    }

    for (let i = 0; i < letters.length; i++) {
      singleLetterString = "";

      for (let j = 0; j < data.hint.positionAndCharacter.length; j++) {
        singleLetterString += letters[i];
      }

      answer = await getWordlePositions(singleLetterString, answer);
    }

    return answer
  }

  async function guessWordle(v) {
    response = await fetch("https://interview.tangohq.com/guess-word", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ "myGuess": v }),
    })

    data = await response.json();

    console.log(`guessing word ${v}`);
    console.log(data);
  }

  response = await fetch("https://interview.tangohq.com/wordle", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  console.log(await response.json())

  await guessWordle(await getWordleAnswer())
}

async function bruteForceESCPOSByte() {
  // brute force to find index 38 (I was so sure it was full cut I didn't think of partial cut)
  for (let i = 0; i < 255; i++) {
    console.log(`calling ${i}`);

    response = await fetch("https://interview.tangohq.com/guess-escpos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ "myGuess": [72, 101, 108, 108, 111, 32, 84, 97, 110, 103, 111, 27, 74, 1, 73, 39, 109, 32, 101, 120, 99, 105, 116, 101, 100, 32, 116, 111, 32, 106, 111, 105, 110, 27, 74, 2, 29, 86, i] }),
    })

    data = await response.json();

    if (data.type != 'INCORRECT_BYTE') {
      console.log(`mystery value is ${i}`);
      break;
    }
  }
}

async function challenge3() {
  response = await fetch("https://interview.tangohq.com/guess-escpos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ "myGuess": [72, 101, 108, 108, 111, 32, 84, 97, 110, 103, 111, 27, 74, 1, 73, 39, 109, 32, 101, 120, 99, 105, 116, 101, 100, 32, 116, 111, 32, 106, 111, 105, 110, 27, 74, 2, 29, 86, 65, 0] }),
  })

  data = await response.json();

  console.log(data);
}

async function upload() {
  response = await fetch("https://interview.tangohq.com/upload", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  console.log(await response.json())
}

(async () => {
  token = await getToken();
  console.log(token);
  await challenge1();
  await challenge2();
  await challenge3();
  await upload();

  // bruteForceESCPOSByte();
})();

// cURL command for submitting github repo:
// curl --header "Content-Type: application/json" --header "Authorization: Bearer {TOKEN}" --request POST --data '{"url":"https://github.com/MarcusOuelletus/tango.git"}' https://interview.tangohq.com/github