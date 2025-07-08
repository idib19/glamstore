'use client';

import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import AppointmentDetails from '../../../components/AppointmentDetails';

export default function MesRendezVousPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <AppointmentDetails />
      <Footer />
    </div>
  );
} 