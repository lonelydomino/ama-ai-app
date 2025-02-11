import Header from '../components/Header';

export default function Home() {
  return (
    <div className="h-screen w-full">
      <Header />
      <div className="flex h-full items-center justify-center bg-green-500 text-white text-4xl">
        Welcome to the Home Page!
      </div>
    </div>
  );
}
