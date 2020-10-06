import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  makeStyles,
  colors
} from '@material-ui/core';
import { MazeMapWrapper } from './MazeMapWrapper';
import './Mapa.css';
import WarningUrl from './warning.svg';

declare var Mazemap: any;

const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [4.680837905742351, 52.0266714794721]
      },
      properties: {
        zLevel: 4,
        statusMapText: 'Alarm!',
        iconUrl: WarningUrl
      }
    }
  ]
};

const markers = [
  {
    lngLat: { lng: 4.680455879978723, lat: 52.026872226902924 },
    options: {
      color: 'MazeBlue',
      size: 28,
      glyphColor: '#FFF',
      glyph: 'i',
      innerCircle: false,
      zLevel: 0
    }
  },
  {
    lngLat: { lng: 4.680349604484775, lat: 52.02682687971986 },
    options: {
      color: 'MazePink',
      size: 28,
      innerCircle: true,
      innerCircleColor: '#FFFFFF',
      innerCircleScale: 0.6,
      shape: 'circle',
      zLevel: 1
    }
  },
  {
    lngLat: { lng: 4.680702165183732, lat: 52.02678486965323 },
    options: {
      color: 'MazeOrange',
      size: 28,
      innerCircle: true,
      innerCircleColor: '#FFFFFF',
      innerCircleScale: 0.6,
      shape: 'marker',
      zLevel: 1
    }
  },
  {
    lngLat: { lng: 4.680551936825054, lat: 52.026857271029996 },
    options: {
      color: 'MazeRed',
      size: 50,
      glyphSize: 30,
      glyph: '🖨',
      glyphColor: 'MazeRed',
      innerCircle: true,
      innerCircleColor: 'white',
      innerCircleScale: 0.7,
      shape: 'marker',
      zLevel: 2
    }
  },
  {
    lngLat: { lng: 4.680283643479584, lat: 52.02679683713336 },
    options: {
      color: 'MazeGreen',
      size: 50,
      glyph: '📗',
      glyphColor: 'MazeGreen',
      innerCircle: true,
      innerCircleColor: 'white',
      innerCircleScale: 0.7,
      shape: 'circle',
      zLevel: 4
    }
  }
];

const useStyles = makeStyles(() => ({
  root: {}
}));

function makeMazeMapInstance() {
  const mazemapRoot = document.createElement('div');
  mazemapRoot.className = 'mazemap-root';
  const mapOptions = {
    container: mazemapRoot,
    campuses: 153,
    center: { lng: 4.680793381640683, lat: 52.02670415793625 },
    zLevel: 4,
    zoom: 20.6,
    scrollZoom: true,
    doubleClickZoom: false,
    touchZoomRotate: false,
    zLevelControl: true
  };
  const map = new Mazemap.Map(mapOptions);

  function addMarkers() {
    let i; let lngLat; let options; let zLevel;

    // let popup = new Mazemap.Popup({closeOnClick: true, offset: [0, -27]})
    // .setHTML('Default click!This is a marker that automatically changes active floor when clicked on.');

    const allMarkers = [];
    for (i = 0; i < markers.length; i++) {
      lngLat = markers[i].lngLat;
      options = markers[i].options;

    const marker = new Mazemap.MazeMarker(options)
        .setLngLat(lngLat)
        //.setPopup(popup)
        .addTo(map);

      allMarkers.push(marker);
    }

    // Zoom to bounds of all markers
    const bounds = new Mazemap.mapboxgl.LngLatBounds();
    allMarkers.forEach((marker) => {
      bounds.extend(marker.getLngLat());
    });
  }

  map.on('load', () => {
    // MazeMap ready
    addMarkers();
  });

  map.on('click', (e) => {
    console.log(e);
  });

  return map;
}

const map = makeMazeMapInstance();

const Mapa = ({ className, ...rest }) => {
  const classes = useStyles();
  const {
    open, clicked, setOpen, setClicked
  } = rest;

  const addMarkers = () => geojson.features.forEach((feature) => {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'custom-alert-marker';
    el.insertAdjacentHTML(
      'afterBegin',
      `<img class="inventory-status-icon" width="30" src="${feature.properties.iconUrl}"><div class="inventory-status-text">${feature.properties.statusMapText}</div>`
    );

    // make a marker for each feature and add to the map
    const marker = new Mazemap.ZLevelMarker(el, {
      zLevel: feature.properties.zLevel,
      offZOpacity: 0.5
    })
      .setLngLat(feature.geometry.coordinates)
      .addTo(map);
    
      marker.on('click', function (e) {
    
        // If we want to change floors, we can manually call the zLevelToggle to set the zLevel to the marker z level
        marker.zLevelToggle();
        moveCamera();
        // Make a custom popup right here on the fly
        new Mazemap.Popup({closeOnClick: true, offset: [0, -6]})
        .setLngLat( marker.getLngLat() )
        .setHTML('Zostały wywarzone drzwi w pokoju 12!')
        .addTo(map);
    
    });

  });

  const moveCamera = () => {
    // setInterval(() => {
    map.flyTo({
      center: { lng: 4.680837242113995, lat: 52.0266646445493 },
      zLevel: 4,
      // center: {lng: 4.680740884934721,lat: 52.02674826512305},
      zoom: 26,
      speed: 0.1,
      essential: true,
      duration: 400
    });
    // }, 5000);
  };

  useEffect(() => {
    if (open) {
      addMarkers();
      // moveCamera();
    }
  }, [open]);

  useEffect(() => {
    if (clicked) {
      setOpen(false);
      setClicked(false);
      moveCamera();
    }
  }, [clicked]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      {/* <CardHeader
        title="Mapa budynku"
      /> */}
      <Divider />
      <CardContent>
        <Box height={600} width={1585} position="relative">
          <MazeMapWrapper map={map} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Mapa;
