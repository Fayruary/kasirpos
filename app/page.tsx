import LandingPage from '@/components/landingpage/index';

export default function Home() {
  return (
    <LandingPage>

      <section className="min-h-screen flex items-center justify-center">
        <h1 className="text-5xl font-bold">
          Section 1 🚀
        </h1>
      </section>

      <section className="min-h-screen flex items-center justify-center">
        <h2 className="text-4xl font-semibold">
          Section 2 🔥
        </h2>
      </section>

    </LandingPage>
  );
}
