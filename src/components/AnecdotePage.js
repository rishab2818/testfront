import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Papa from "papaparse"; // For parsing CSV data

const anecdote_quote = [
  {
    anecdote:
      "During the Civil Rights Movement, Martin Luther King Jr.'s 'I Have a Dream' speech, though poetic and non-legislative, inspired millions and became a catalyst for social change, proving that poetry and words can shape history.",
    quote1:
      "'Poetry is when an emotion has found its thought and the thought has found words.' – Robert Frost",
    quote2:
      "'Poetry is not a turning loose of emotion, but an escape from emotion.' – T.S. Eliot",
    quote3:
      "'Words are, of course, the most powerful drug used by mankind.' – Rudyard Kipling",
  },
  {
    anecdote:
      "Steve Jobs initially focused on creating computers, but when he realigned Apple’s vision towards revolutionizing personal technology with the iPod, iPhone, and iPad, he built an empire. His ladder, once on the wrong wall, found the right one.",
    quote1:
      "'If you don’t know where you are going, any road will get you there.' – Lewis Carroll",
    quote2:
      "'Success is not just about climbing the ladder, but ensuring it’s leaning against the right wall.' – Stephen R. Covey",
    quote3:
      "'It is not enough to be busy… The question is: what are we busy about?' – Henry David Thoreau",
  },
  {
    anecdote:
      "Christopher Columbus set sail without a precise map of the world, but his insatiable curiosity led to the discovery of new lands. Had he stayed within the known routes, history would have been very different.",
    quote1:
      "'I have no special talents. I am only passionately curious.' – Albert Einstein",
    quote2: "'Not all those who wander are lost.' – J.R.R. Tolkien",
    quote3:
      "'Curiosity is the wick in the candle of learning.' – William Arthur Ward",
  },
  {
    anecdote:
      "Nikola Tesla, though a pioneer in electricity, died penniless because his goal was never financial success but the betterment of humanity. His purposeful pursuit shaped modern civilization despite his personal hardships.",
    quote1:
      "'Efforts and courage are not enough without purpose and direction.' – John F. Kennedy",
    quote2:
      "'He who has a why to live can bear almost any how.' – Friedrich Nietzsche",
    quote3:
      "'The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate.' – Ralph Waldo Emerson",
  },
  {
    anecdote:
      "The Wright brothers had a vision of human flight, but it was their relentless experimentation and action that turned their dream into reality. Conversely, Napoleon's ambition without a clear long-term vision led to his downfall.",
    quote1:
      "'A goal without a plan is just a wish.' – Antoine de Saint-Exupéry",
    quote2:
      "'The only thing worse than being blind is having sight but no vision.' – Helen Keller",
    quote3:
      "'Strategy without tactics is the slowest route to victory. Tactics without strategy is the noise before defeat.' – Sun Tzu",
  },

  {
    anecdote:
      "When Mahatma Gandhi was asked about his goals, he emphasized that happiness lay not in reaching a destination but in living by one’s values every day. His life’s work was a testament to the journey being more meaningful than any single achievement.",
    quote1:
      "'Happiness is not a station you arrive at, but a manner of traveling.' – Margaret Lee Runbeck",
    quote2:
      "'It is good to have an end to journey toward, but it is the journey that matters in the end.' – Ursula K. Le Guin",
    quote3:
      "'Success is a journey, not a destination. The doing is often more important than the outcome.' – Arthur Ashe",
  },
  {
    anecdote:
      "In 1997, the Kyoto Protocol was established to combat climate change, but it failed due to unequal responsibilities among nations. Developed countries, historically responsible for emissions, resisted bearing the greater burden, highlighting the challenge of fair environmental justice.",
    quote1:
      "'The environment is where we all meet; where we all have a mutual interest.' – Lady Bird Johnson",
    quote2:
      "'We won’t have a society if we destroy the environment.' – Margaret Mead",
    quote3:
      "'The earth does not belong to us: we belong to the earth.' – Chief Seattle",
  },
  {
    anecdote:
      "When the ozone layer depletion crisis emerged in the late 20th century, international cooperation led to the Montreal Protocol, banning CFCs. This decision was made not for immediate gains but to protect future generations, embodying the idea that we are mere caretakers of the Earth.",
    quote1:
      "'The greatest threat to our planet is the belief that someone else will save it.' – Robert Swan",
    quote2: "'Take care of the earth and she will take care of you.' – Unknown",
    quote3:
      "'A society grows great when old men plant trees whose shade they know they shall never sit in.' – Greek Proverb",
  },
  {
    anecdote:
      "In the Space Race, the Soviet Union took the lead by launching Sputnik in 1957, but the U.S., with a clear long-term vision, eventually landed on the Moon in 1969. This proved that progress is about direction, not just who moves first.",
    quote1:
      "'It does not matter how slowly you go as long as you do not stop.' – Confucius",
    quote2:
      "'Direction is more important than speed. Many are going nowhere fast.' – Unknown",
    quote3:
      "'The road to success is dotted with many tempting parking spaces.' – Will Rogers",
  },
  {
    anecdote:
      "During the Middle Ages, the geocentric model of the universe was widely accepted despite evidence to the contrary. Galileo’s work was condemned because people clung to their perceived knowledge rather than accepting new truths.",
    quote1:
      "'Real knowledge is to know the extent of one's ignorance.' – Confucius",
    quote2: "'The only true wisdom is in knowing you know nothing.' – Socrates",
    quote3:
      "'A fool thinks himself to be wise, but a wise man knows himself to be a fool.' – William Shakespeare",
  },
  {
    anecdote:
      "Japan is a prime example of blending tradition with modernity. The country has cutting-edge technology while preserving ancient customs like tea ceremonies and Shinto rituals, proving that the old and the new can complement each other.",
    quote1:
      "'Progress is impossible without change, and those who cannot change their minds cannot change anything.' – George Bernard Shaw",
    quote2:
      "'Tradition is not the worship of ashes, but the preservation of fire.' – Gustav Mahler",
    quote3:
      "'The past gives us roots; the present gives us opportunities; the future calls for vision.' – John F. Kennedy",
  },
  {
    anecdote:
      "Ludwig Wittgenstein, a philosopher of language, argued that our reality is shaped by the language we use. He demonstrated how people’s thoughts and perceptions are often limited by the words available to them, showing both the power and the constraints of language.",
    quote1:
      "'The limits of my language mean the limits of my world.' – Ludwig Wittgenstein",
    quote2:
      "'Language is the road map of a culture. It tells you where its people come from and where they are going.' – Rita Mae Brown",
    quote3:
      "'Words are free. It’s how you use them that may cost you.' – Unknown",
  },
];

const AnecdotePage = () => {
  const [explainers, setExplainers] = useState([]);
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * anecdote_quote.length);

  // Get the random anecdote and quotes
  const randomAnecdote = anecdote_quote[randomIndex].anecdote;
  const randomQuote1 = anecdote_quote[randomIndex].quote1;
  const randomQuote2 = anecdote_quote[randomIndex].quote2;
  const randomQuote3 = anecdote_quote[randomIndex].quote3;

  // Fetch explainers from Google Sheets
  useEffect(() => {
    const fetchExplainers = async () => {
      try {
        // Replace with your published Google Sheets CSV URL
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTGeanBswBOTAR40iKf4zX6EcVEpJrj-MqjUS4lA3F4ESMZXl6W1hv8jugBSjOYRBWod7tC2MQaakE/pub?output=csv"
        );
        const text = await response.text();
        const result = Papa.parse(text, { header: true }); // Parse CSV to JSON
        setExplainers(result.data); // Set explainers to state
      } catch (error) {
        console.error("Error fetching explainers:", error);
      }
    };

    fetchExplainers();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Anecdote</h2>
          <p className="card-text">{randomAnecdote}</p>
          <hr />
          <h4 className="text-center">Inspiring Quotes</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item border-0">{randomQuote1}</li>
            <li className="list-group-item border-0">{randomQuote2}</li>
            <li className="list-group-item border-0">{randomQuote3}</li>
          </ul>
          <hr />
          {/* Recent Explainers from PIB */}
          <h4 className="text-center">Recent Explainers from PIB</h4>
          {explainers.length > 0 ? (
            explainers.map((explainer, index) => (
              <div key={index} className="mb-4">
                <h5>{explainer.Title}</h5>
                <p>{explainer.Content}</p>
              </div>
            ))
          ) : (
            <p>Loading explainers...</p>
          )}
          <hr />

          {/* Questions Based on Explainers */}
          <h4 className="text-center">Questions Based on Explainers</h4>
          {explainers.length > 0 ? (
            explainers.map((explainer, index) => (
              <div key={index} className="mb-4">
                <h5>Explainer {index + 1}</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item border-0">
                    <b>Mains Question 1:</b> {explainer["Question 1"]}
                  </li>
                  <li className="list-group-item border-0">
                    <b>Mains Question 2:</b> {explainer["Question 2"]}
                  </li>
                  <li className="list-group-item border-0">
                    <b>Prelims Question 3:</b> {explainer["Question 3"]}
                  </li>
                  <li className="list-group-item border-0">
                    <b>Prelims Question 4:</b> {explainer["Question 4"]}
                  </li>
                </ul>
              </div>
            ))
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnecdotePage;
