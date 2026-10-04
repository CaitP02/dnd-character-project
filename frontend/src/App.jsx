import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import CharacterList from './pages/CharacterList.jsx';
import CharacterPage from './pages/CharacterPage.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<CharacterList />} />
      <Route path="characters/new" element={<CharacterPage />} />
      <Route path="characters/:id" element={<CharacterPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;
