var generateQuote, quotes, said, speaker;

  speaker = '';

  said = '';

  quotes = [
  {quote: "I want the world's greatest ice cream!", character: "Chibi Mai"}  
  
{quote: "One-Million Zeni!", character: "Chibi Shu"}

{quote: "Revive Krillin!...wait, on second thought.", character: "Said everyone, ever"}

{quote: "Kakarot!!!", character: "Broly"}

{quote: "Chocolate!!!", character: "Majin Buu"}

{quote: "Give me ALL of Earth's finest cuisines. NOW!", character: "Lord Beerus"}

{quote: "A better future.", character: "Future Trunks"}

{quote: "Restore my youth!", character: "King Piccolo"}
  
{quote: "A pretty lady.", character: "Master Roshi"}

{quote: "Eliminate every last Saiyan monkey!", character: "Frieza"}

{quote: "Revive everyone killed by Freiza and his army.", character: "Dende"}

{quote: "Remove the explosive devices from Android 17 and 18's bodies.", character: "Krillin"}

{quote: "Restore Earth and all of it's living inhabitants.", character: "Vegeta"}

{quote: "Tell me how to become a Super Saiyan God.", character: "Goku"}

{quote: "Switch my body with that of Son Goku!", character: "Alternate Zamasu" },
  
{quote: "Make me immortal!", character: "Future Zamasu"}

{quote: "Bring back all the universes that were eliminated.", character: "Android 17" }];


generateQuote = ->
	randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
	if randomQuote.quote.length + randomQuote.character.length > 97
		generateQuote()
	else
		$('.quote').text randomQuote.quote
		$('.character').text randomQuote.character
		said = randomQuote.quote.split(' ').join('%20')
		speaker = randomQuote.character.split(' ').join('%20')

$(document).ready ->
	$('.btn-tweet').hide()
	$('.btn-make-a-wish').on('click', ->
		generateQuote()
		$('.twitter').attr('href', 'https://twitter.com/intent/tweet?text=' + speaker + '%20said,%20"' + said + '"%20%23DBZ%20https://raw.githubusercontent.com/karlwhite247/freeCodeCamp-projects/master/03%20-%20Front%20End%20Libraries/Build%20a%20Random%20Quote%20Machine/images/Build%20a%20Random%20Quote%20Machine.png').attr('target', '_blank')
		$('.btn-tweet').show()
	)