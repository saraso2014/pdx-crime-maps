import React, { useState } from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";

const CrimeMap = (props) => {
  const { crimeData, eventRenderer, event, crimeIcon } = props;
  const [activeCrime, setCrime] = useState(null);

  return (
      <Map center={[45.523064,-122.676483]} zoom={12}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

        {crimeData && crimeData.map(crime => (
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
              <h2>{activeCrime.text}</h2>
              <p>{activeCrime.category}</p>
            </div>
          </Popup>
        )}
      </Map>
  );
}

export default CrimeMap;