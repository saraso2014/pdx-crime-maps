import React, { useEffect, useState } from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import * as crimeData from "./data/pdx-crime-data.json";
import useDropdown from './useDropdown';
import BarChart from './BarChart';
import axios from 'axios';

import "./App.css";
import { filteredOptions, crimeIcon, eventRenderer, stolenVehicleChartData } from './Helper.js'

export default function App() {
  const [activeCrime, setCrime] = useState(null);
  const [event, EventDropdown] = useDropdown("Crime", "All", filteredOptions);
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'http://localhost:5431/tweets',
      );
      setData(result.data);
    }
    fetchData();
  }, []);

  console.log(stolenVehicleChartData(data))

  // Dark Mode "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"

  return (
    <div className="container">
      <EventDropdown />
      <Map center={[45.523064,-122.676483]} zoom={12}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

        {crimeData.tweets && crimeData.tweets.map(crime => (
          eventRenderer(event, crime) &&
          <Marker
            key={crime.tweet_id}
            position={[
              crime.lat,
              crime.lng
            ]}
            onClick={() => {
              setCrime(crime);
            }}
            icon={crimeIcon(crime)}
          />
        ))}

        {activeCrime && (
          <Popup
            position={[
              activeCrime.lat,
              activeCrime.lng
            ]}
            onClose={() => {
              setCrime(null);
            }}
          >
            <div>
              <h2>{activeCrime.tweet}</h2>
              <p>{activeCrime.category}</p>
            </div>
          </Popup>
        )}
      </Map>

      <BarChart data={stolenVehicleChartData(data)}
                text={stolenVehicleChartData(data).datasets[0].label}
        />
    </div>
  );  
}