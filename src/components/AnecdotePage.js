import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AnecdotePage = () => {
  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            Adaptability: The Key to Survival
          </h2>
          <p className="card-text">
            Dr. K. Radhakrishnan, former ISRO chairman, faced immense challenges
            when spearheading India's Mars Orbiter Mission (Mangalyaan). The
            project had to be completed within a strict budget and timeframe,
            forcing his team to innovate and adapt quickly. By embracing change
            and leveraging indigenous technology, they succeeded where many had
            failed, making India the first country to reach Mars on its maiden
            attempt. This story exemplifies that true success lies not in
            strength or intelligence alone, but in the ability to adapt and
            evolve.
          </p>
          <hr />
          <h4 className="text-center">Inspiring Quotes</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item border-0">
              "It is not the strongest of the species that survive, nor the most
              intelligent, but the one most responsive to change." – Charles
              Darwin
            </li>
            <li className="list-group-item border-0">
              "Change is the end result of all true learning." – Leo Buscaglia
            </li>
            <li className="list-group-item border-0">
              "Survival is not about being fearless. It’s about making a
              decision, getting on and doing it." – Bear Grylls
            </li>
          </ul>
          <hr />
          <h4 className="text-center">PIB Recent Factsheets</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item border-0">
              CPI inflation moderated to a 7-month low of 3.6% in February 2025,
              aided by a sharp decline in vegetable prices.
            </li>
            <li className="list-group-item border-0">
              Core inflation crossed 4% for the first time in 14 months,
              reaching 4.08%.
            </li>
            <li className="list-group-item border-0">
              Industrial growth strengthened, with IIP expanding by 5.0% in
              January 2025, led by manufacturing and mining.
            </li>
            <li className="list-group-item border-0">
              Rural inflation remains higher than urban inflation, influenced by
              food price trends.
            </li>
            <li className="list-group-item border-0">
              Imported inflation surged, rising from 1.3% in June 2024 to 31.1%
              in February 2025, driven by rising prices of precious metals,
              oils, and fats.
            </li>
            <li className="list-group-item border-0">
              RBI expected to implement at least 75 basis points of rate cuts in
              2025, with successive reductions anticipated in April and August.
            </li>
            <li className="list-group-item border-0">
              Corporate performance remains strong, with revenue, EBITDA, and
              PAT growth of 6.2%, 11%, and 12%, respectively, in Q3FY25.
            </li>
          </ul>
          <hr />
          <h4 className="text-center">Questions Based on Factsheet</h4>
          <h5>Essay Questions</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item border-0">
              <b>1.</b> Discuss the recent trends in India's inflation dynamics,
              highlighting the role of core inflation, imported inflation, and
              sectoral variations. How should monetary policy respond to these
              evolving trends? (250 words)
            </li>
            <li className="list-group-item border-0">
              <b>2.</b> The Index of Industrial Production (IIP) in India has
              shown significant growth, led by the manufacturing and mining
              sectors. Analyze the factors contributing to this growth and
              evaluate the challenges that could hinder sustained industrial
              expansion. (250 words)
            </li>
          </ul>
          <h5>Prelims Questions</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item border-0">
              <b>1.</b> With reference to inflation in an economy, consider the
              following statements:
              <ul>
                <li>
                  Core inflation is more volatile than headline inflation as it
                  includes food and fuel prices.
                </li>
                <li>
                  A rise in imported inflation can occur even when domestic
                  production remains stable.
                </li>
                <li>
                  Lower Consumer Price Index (CPI) inflation always indicates a
                  stronger purchasing power for consumers.
                </li>
              </ul>
              Which of the statements given above is/are correct?
              <ul>
                <li>(a) 1 and 2 only</li>
                <li>(b) 2 only</li>
                <li>(c) 1 and 3 only</li>
                <li>(d) 2 and 3 only</li>
              </ul>
            </li>
            <li className="list-group-item border-0">
              <b>2.</b> Consider the following statements regarding the Index of
              Industrial Production (IIP):
              <ul>
                <li>
                  It is a measure of industrial performance that includes
                  mining, manufacturing, and electricity sectors.
                </li>
                <li>
                  An increase in IIP always indicates a rise in employment and
                  economic well-being.
                </li>
                <li>
                  A decline in consumer non-durables production can indicate
                  weaker demand in the economy.
                </li>
              </ul>
              Which of the statements given above is/are correct?
              <ul>
                <li>(a) 1 and 2 only</li>
                <li>(b) 1 and 3 only</li>
                <li>(c) 2 and 3 only</li>
                <li>(d) 1, 2, and 3</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnecdotePage;
