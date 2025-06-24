// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import FormsDataPage from './pages/FormsDataPage';
import ReelsPage from './pages/ReelsPage';
import Login from './pages/Login';
import Packages from './pages/Packages';
import RoomImages from './pages/RoomImages';
import Gallery from './pages/Gallery';
import Facilites from './pages/Facilites';


const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route path="forms" element={<FormsDataPage />} />
        <Route path="reels" element={<ReelsPage />} />
        <Route path="packages" element={<Packages />} />
        <Route path="room-images" element={<RoomImages />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="facilities" element={<Facilites />} />
        <Route index element={<FormsDataPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;