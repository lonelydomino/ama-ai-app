import Header from '../components/Header';

export default function Dashboard() {
  return (
    <div>
      <Header />
      <div className="flex h-screen items-center justify-center bg-blue-500 text-white text-4xl">
        Welcome to the Dashboard!
      </div>
    </div>
  );
}
