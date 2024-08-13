import React, { useEffect, useRef } from 'react';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import Graphic from '@arcgis/core/Graphic';
import { geodesicLength } from '@arcgis/core/geometry/geometryEngine';
import Polyline from '@arcgis/core/geometry/Polyline';

const MapComponent = () => {
  const mapDiv = useRef(null);

  useEffect(() => {
    const webmap = new WebMap({
      basemap: 'topo-vector',
    });

    const view = new MapView({
      container: mapDiv.current,
      map: webmap,
      center: [77.1025,28.7041],
      zoom: 10,
    });

    let points = [];

    view.on('click', (event) => {
      const point = {
        type: 'point',
        longitude: event.mapPoint.longitude,
        latitude: event.mapPoint.latitude,
      };

      points.push(point);

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: {
          type: 'simple-marker',
          color: 'blue',
          size: '12px',
        },
      });

      view.graphics.add(pointGraphic);

      if (points.length === 2) {
        const polyline = new Polyline({
          paths: [
            [points[0].longitude, points[0].latitude],
            [points[1].longitude, points[1].latitude],
          ],
          spatialReference: { wkid: 4326 },
        });

        const distance = geodesicLength(polyline, 'kilometers');
        alert(`Distance: ${distance.toFixed(2)} km`);

        points = [];
        view.graphics.removeAll();
      }
    });
  }, []);

  return <div style={{ height: '100vh', width: '100%' }} ref={mapDiv}></div>;
};

export default MapComponent;
