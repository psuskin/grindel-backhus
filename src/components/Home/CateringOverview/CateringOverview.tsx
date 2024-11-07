import Image from "next/image";

const CateringOverview = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
          Grindel Backhus Catering - Immer Einfach, Jedes Mal!
        </h1>

        <div className="flex flex-col lg:flex-row items-center mb-24">
          <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Catering für private Feiern und geschäftliche Veranstaltungen
            </h2>
            <p className="text-gray-600 mb-6">
              Ob Du auf der Suche nach einem Catering für Deinen großen Tag, für
              Dich oder jemanden aus Deinem Team im Unternehmen bist - Grindel
              Backhus catering bietet Dir, Deinen Gästen und Deinem Team alles,
              was Ihr braucht! Schaue Dir unser Angebot an und buche
              deutschlandweit ganz einfach online Dein Catering und überrasche
              Deine Gäste oder Mitarbeiter und Kollegen im Unternehmen mit
              leckerem Essen.
            </p>
            <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-700 transition duration-300">
              zum Angebot
            </button>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <Image
              src="/images/menu.jpg"
              alt="Catering event"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
            <Image
              src="/images/menu.jpg"
              alt="Catering food"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
            <Image
              src="/images/menu.jpg"
              alt="Catering service"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
            <Image
              src="/images/menu.jpg"
              alt="Catering presentation"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 grid grid-cols-2 gap-4 mb-8 lg:mb-0">
            <Image
              src="/images/menu.jpg"
              alt="Local caterer"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
            <Image
              src="/images/menu.jpg"
              alt="Food preparation"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="lg:w-1/2 lg:pl-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Deutschlandweit immer regional dank unserer 200 lokalen Caterer
            </h2>
            <p className="text-gray-600 mb-6">
              Du buchst online und wir liefern – überall in Deutschland. Wir
              pflegen deutschlandweit ein dichtes Netzwerk engagierter Küchen
              und Caterer. Somit produzieren und liefern wir immer regional!
            </p>
            <p className="text-gray-600 mb-6">
              So können wir deutschlandweit auch kurzfristige Bestellungen für
              alle privaten und geschäftlichen Anlässe nach wenige Tage vor
              Lieferdatum annehmen und Kapazitäten zwischen verschiedenen
              lokalen Küchen optimal auslasten. Mit unserer Vielfalt an
              exquisiten Gerichten inklusive kostenloser Beratung gehen wir auf
              Deine Bedürfnisse und Dein Budget oder das der Firma ein.
            </p>
            <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-700 transition duration-300">
              Jetzt auswählen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CateringOverview;
