document.addEventListener("DOMContentLoaded", () => {
    // --- Estructura del Juego y Puzzles ---
    const puzzles = [
        {
            title: "La Carta Anónima",
            description: "Has recibido una carta anónima con un mapa antiguo. Para encontrar las coordenadas (x,y) de la primera pista, debes resolver la siguiente ecuación. El valor 'x' es la solución más pequeña y 'y' es la más grande. La respuesta debe ser en formato (x,y).",
            question: "$$x^2 - 4x - 12 = 0$$",
            solution: ["(-2,6)"],
            hint: "Usa la fórmula general o factorización para encontrar las dos soluciones. Asegúrate de ordenar los valores de menor a mayor para obtener la coordenada correcta."
        },
        {
            title: "El Cofre y su Candado",
            description: "Al llegar a las coordenadas, encuentras un cofre. En la parte inferior hay instrucciones: la clave del candado son tres números ordenados de menor a mayor, que corresponden a las dos soluciones de la ecuación y la suma de estas soluciones. Ingresa los números separados por comas.",
            question: "$$x^2 - 2x - 3 = 0$$",
            solution: ["-1,2,3"],
            hint: "Factoriza la ecuación para encontrar las dos soluciones. La clave se forma con la solución más pequeña, la suma de ambas, y la solución más grande."
        },
        {
            title: "La Nota de la Biblioteca",
            description: "Dentro del cofre hay una nota que te dirige a la biblioteca. Para saber qué párrafo y página leer de un libro, debes resolver la siguiente ecuación. La solución más pequeña es el número de párrafo y la más grande es el número de página. Ingresa los números separados por comas.",
            question: "$$x^2 - 15x + 50 = 0$$",
            solution: ["5,10"],
            hint: "Factoriza la ecuación para encontrar las dos soluciones. La clave es la solución más pequeña (párrafo) y luego la más grande (página)."
        },
        {
            title: "El Acertijo del Libro",
            description: "En el libro encuentras una adivinanza que te lleva a tu siguiente destino. Resuelve la adivinanza para encontrar la clave.",
            question: `
            <div class="text-left">
                Tengo cuadros, pero no soy un libro de pintar.<br>
                Tengo estatuas, pero no soy un jardín para caminar.<br>
                En mis salas, el pasado se hace presente y la historia revive.<br>
                Soy un lugar de silencio donde el arte y el conocimiento viven.<br>
                ¿Qué soy?
            </div>
            `,
            solution: ["el museo"],
            hint: "Es un lugar donde se guardan objetos de arte e historia para el público."
        },
        {
            title: "El Enigma del Fundador",
            description: "Has llegado al museo. En la base de la estatua del fundador, encuentras el siguiente enigma. La clave para la siguiente pista es la suma de las soluciones de esta ecuación. Ingresa la suma como un número.",
            question: "$$x^2 - 8x - 20 = 0$$",
            solution: ["8"],
            hint: "Las soluciones de la ecuación son 10 y -2. La suma es 8."
        },
        {
            title: "El Tesoro Escondido",
            description: "Encuentras el reloj de arena. Una placa indica la ubicación del tesoro, pero está encriptada. La clave para abrir el cofre es la suma del número de página y el número de párrafo que encontraste en el desafío de la biblioteca.",
            question: "Ingresa la contraseña para abrir el cofre del tesoro.",
            solution: ["15"],
            hint: "Regresa al desafío de 'La Nota de la Biblioteca'. Suma el número de página y el número de párrafo que obtuviste como respuesta."
        }
    ];

    // --- Variables de estado del juego ---
    let currentPuzzleIndex = 0;
    const totalPuzzles = puzzles.length;
    let finalCode = "";
    let pageAndParagraphValues = { page: 10, paragraph: 5 };

    // --- Referencias a los elementos del DOM ---
    const gameContent = document.getElementById("game-content");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const progressBarContainer = document.getElementById("progress-bar-container");

    // --- Funciones del Juego ---

    const checkSolution = (input, solutions) => {
        const cleanedInput = input.replace(/\s/g, '').toLowerCase();
        return solutions.some(sol => sol.toLowerCase() === cleanedInput);
    };

    const renderPuzzle = () => {
        const puzzle = puzzles[currentPuzzleIndex];
        gameContent.innerHTML = `
            <h3 class="text-xl font-bold mb-2 text-white">${puzzle.title}</h3>
            <p class="mb-4 text-gray-200">${puzzle.description}</p>
            <div id="question-container" class="bg-black/40 p-4 rounded-lg mb-4 text-center text-xl font-mono text-white">
                ${puzzle.question}
            </div>
            <form id="puzzle-form" class="flex flex-col space-y-4">
                <input
                    type="text"
                    id="answer-input"
                    placeholder="Ingresa tu respuesta aquí..."
                    class="p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 text-gray-900 bg-white dark:bg-gray-800 dark:text-white"
                    required
                />
                <button
                    type="submit"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                    Resolver
                </button>
            </form>
            <p id="feedback" class="mt-2 text-center text-sm font-semibold"></p>
            <p class="mt-4 text-sm text-gray-300">
                <span class="font-bold">Pista:</span> ${puzzle.hint}
            </p>
        `;

        renderMathInElement(document.getElementById("question-container"), {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
            ],
            throwOnError: false
        });

        document.getElementById("puzzle-form").addEventListener("submit", handleSubmit);
        updateProgressBar();
    };

    const renderWinScreen = () => {
        progressBarContainer.style.display = 'none';
        finalCode = pageAndParagraphValues.page + pageAndParagraphValues.paragraph;
        
        gameContent.innerHTML = `
            <div class="text-center p-6 bg-green-50/20 rounded-lg shadow-inner backdrop-blur-sm">
                <h2 class="text-3xl font-bold text-green-300 mb-4">¡Felicitaciones! ¡Has escapado!</h2>
                <p class="text-lg text-gray-100 mb-4">Has resuelto todos los enigmas y encontrado la clave final. La clave es:</p>
                <div class="bg-white/20 text-3xl font-bold tracking-widest p-4 rounded-lg text-indigo-400">
                    ${finalCode}
                </div>
                <button
                    id="reset-button"
                    class="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                    Jugar de nuevo
                </button>
            </div>
        `;
        document.getElementById("reset-button").addEventListener("click", resetGame);
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const inputValue = document.getElementById("answer-input").value;
        const feedbackElement = document.getElementById("feedback");
        const currentPuzzle = puzzles[currentPuzzleIndex];
        
        let isCorrect = checkSolution(inputValue, currentPuzzle.solution);

        if (isCorrect) {
            feedbackElement.textContent = "¡Correcto! Pista desbloqueada.";
            feedbackElement.className = "mt-2 text-center text-sm font-semibold text-green-400";
            
            if (currentPuzzleIndex === 2) {
                const [paragraph, page] = inputValue.split(',').map(Number);
                pageAndParagraphValues = { paragraph, page };
            }

            setTimeout(() => {
                currentPuzzleIndex++;
                if (currentPuzzleIndex < puzzles.length) {
                    renderPuzzle();
                } else {
                    renderWinScreen();
                }
            }, 1000);
        } else {
            feedbackElement.textContent = "Inténtalo de nuevo. Revisa la pista y el formato.";
            feedbackElement.className = "mt-2 text-center text-sm font-semibold text-red-400";
        }
    };

    const updateProgressBar = () => {
        const progress = ((currentPuzzleIndex + 1) / totalPuzzles) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Pista ${currentPuzzleIndex + 1} de ${totalPuzzles}`;
    };

    const resetGame = () => {
        currentPuzzleIndex = 0;
        progressBarContainer.style.display = 'block';
        renderPuzzle();
    };

    renderPuzzle();
});
