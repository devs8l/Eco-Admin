// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import FormsDataPage from './pages/FormsDataPage';
import ReelsPage from './pages/ReelsPage';
import Login from './pages/Login';


const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route path="forms" element={<FormsDataPage />} />
        <Route path="reels" element={<ReelsPage />} />
        <Route index element={<FormsDataPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;