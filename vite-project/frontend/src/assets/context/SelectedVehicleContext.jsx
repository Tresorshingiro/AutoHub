import React, { createContext, useContext, useState } from 'react';

const SelectedVehicleContext = createContext();

export const SelectedVehicleProvider = ({ children }) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  return (
    <SelectedVehicleContext.Provider value={{ selectedVehicleId, setSelectedVehicleId }}>
      {children}
    </SelectedVehicleContext.Provider>
  );
};

export const useSelectedVehicle = () => {
  const context = useContext(SelectedVehicleContext);
  if (!context) {
    throw new Error('useSelectedVehicle must be used within a SelectedVehicleProvider');
  }
  const { selectedVehicleId, setSelectedVehicleId } = context;
  return { selectedVehicleId: selectedVehicleId || null, setSelectedVehicleId };
};
