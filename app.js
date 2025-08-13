document.addEventListener("DOMContentLoaded", () => {
    // --- Estructura del Juego y Puzzles ---
    const puzzles = [
        {
            title: "La Carta Anónima",
            description: "Has recibido una carta anónima con un mapa antiguo. Para encontrar las coordenadas (x,y) de la primera pista, debes resolver la siguiente ecuación. El valor 'x' es la solución más pequeña y 'y' es la más grande. La respuesta debe ser en formato (x,y).",
            question: "$$x^2 - 4x - 12 = 0$$",
            solution: ["(-2,6)"],
            hints: [
                "Esta es una ecuación cuadrática. Necesitas encontrar dos valores de 'x' que la satisfagan.",
                "Puedes factorizar la ecuación buscando dos números que multiplicados den -12 y sumados den -4.",
                "Los números son 2 y -6. La factorización es $(x-6)(x+2) = 0$. ¿Cuáles son las soluciones?"
            ]
        },
        {
            title: "El Cofre y su Candado",
            description: "Al llegar a las coordenadas, encuentras un cofre. En la parte inferior hay instrucciones: la clave del candado son tres números ordenados de menor a mayor, que corresponden a las dos soluciones de la ecuación y la suma de estas soluciones. Ingresa los números separados por comas.",
            question: "$$x^2 - 2x - 3 = 0$$",
            solution: ["-1,2,3"],
            hints: [
                "Primero, resuelve la ecuación cuadrática para encontrar los dos valores de 'x'.",
                "Las soluciones de la ecuación son -1 y 3. Ahora, calcula la suma de estos dos números.",
                "Las soluciones son -1 y 3. La suma es -1 + 3 = 2. Ordena los tres números de menor a mayor para obtener la clave."
            ]
        },
        {
            title: "La Nota de la Biblioteca",
            description: "Dentro del cofre hay una nota que te dirige a la biblioteca. Para saber qué párrafo y página leer de un libro, debes resolver la siguiente ecuación. La solución más pequeña es el número de párrafo y la más grande es el número de página. Ingresa los números separados por comas.",
            question: "$$x^2 - 15x + 50 = 0$$",
            solution: ["5,10"],
            hints: [
                "Resuelve la ecuación cuadrática para encontrar los dos valores de 'x'.",
                "Puedes factorizar la ecuación buscando dos números que multiplicados den 50 y sumados den -15.",
                "Los números son 5 y 10. La factorización es $(x-5)(x-10)=0$. Por lo tanto, las soluciones son 5 y 10. Ordena los valores de menor a mayor."
            ]
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
            hints: [
                "Piensa en un lugar donde puedes ver cuadros y estatuas.",
                "Es un lugar donde se exhiben objetos de valor histórico o artístico.",
                "La respuesta es 'el museo'."
            ]
        },
        {
            title: "El Enigma del Fundador",
            description: "Has llegado al museo. En la base de la estatua del fundador, encuentras el siguiente enigma. La clave para la siguiente pista es la suma de las soluciones de esta ecuación. Ingresa la suma como un número.",
            question: "$$x^2 - 8x - 20 = 0$$",
            solution: ["8"],
            hints: [
                "Para encontrar la clave, necesitas resolver la ecuación y luego sumar las soluciones.",
                "Las soluciones de la ecuación son 10 y -2.",
                "La suma de las soluciones es $10 + (-2) = 8$. La clave es 8."
            ]
        },
        {
            title: "El Tesoro Escondido",
            description: "Encuentras el reloj de arena. Una placa indica la ubicación del tesoro, pero está encriptada. La clave para abrir el cofre es la suma del número de página y el número de párrafo que encontraste en el desafío de la biblioteca.",
            question: "Ingresa la contraseña para abrir el cofre del tesoro.",
            solution: ["15"],
            hints: [
                "Esta clave no es un nuevo cálculo, sino la combinación de respuestas anteriores.",
                "Recuerda la respuesta del tercer desafío ('La Nota de la Biblioteca').",
                "En el tercer desafío, obtuviste los números 5 y 10. La clave es la suma de ambos."
            ]
        }
    ];

    // --- Variables de estado del juego ---
    let currentPuzzleIndex = 0;
    const totalPuzzles = puzzles.length;
    let finalCode = "";
    let pageAndParagraphValues = { page: 10, paragraph: 5 };
    let currentHintIndex = -1; // Para llevar la cuenta de las pistas reveladas

    // --- Referencias a los elementos del DOM ---
    const gameContent = document.getElementById("game-content");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const progressBarContainer = document.getElementById("progress-bar-container");
    const hintModal = document.getElementById("hint-modal");
    const hintContent = document.getElementById("hint-content");
    const nextHintBtn = document.getElementById("next-hint-btn");
    const closeHintBtn = document.getElementById("close-hint-btn");

    // --- Funciones del Juego ---

    const checkSolution = (input, solutions) => {
        const cleanedInput = input.replace(/\s/g, '').toLowerCase();
        return solutions.some(sol => sol.toLowerCase() === cleanedInput);
    };

    const renderPuzzle = () => {
        const puzzle = puzzles[currentPuzzleIndex];
        currentHintIndex = -1; // Reinicia el contador de pistas para el nuevo desafío
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
            
            <!-- Botón para abrir el modal de pistas -->
            <button id="open-hint-btn" class="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200">
                Ver Pistas
            </button>
        `;

        renderMathInElement(document.getElementById("question-container"), {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
            ],
            throwOnError: false
        });

        document.getElementById("puzzle-form").addEventListener("submit", handleSubmit);
        document.getElementById("open-hint-btn").addEventListener("click", openHintModal);
        updateProgressBar();
    };

    const renderWinScreen = () => {
        progressBarContainer.style.display = 'none';
        // La clave final se genera sumando los valores obtenidos en el desafío de la biblioteca
        finalCode = pageAndParagraphValues.paragraph + pageAndParagraphValues.page;
        
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
            
            // Guarda los valores de página y párrafo del tercer desafío
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

    // --- Funciones para el Modal de Pistas ---
    const openHintModal = () => {
        hintContent.innerHTML = "<p class='text-center text-gray-400'>Aún no se ha revelado ninguna pista. Haz clic en 'Siguiente Pista' para ver la primera.</p>";
        currentHintIndex = -1;
        nextHintBtn.classList.remove('hidden');
        hintModal.classList.remove('hidden');
        hintModal.classList.add('flex');
    };
    
    const closeHintModal = () => {
        hintModal.classList.add('hidden');
        hintModal.classList.remove('flex');
    };

    const revealNextHint = () => {
        const currentPuzzle = puzzles[currentPuzzleIndex];
        currentHintIndex++;

        if (currentHintIndex < currentPuzzle.hints.length) {
            const hintText = currentPuzzle.hints[currentHintIndex];
            const hintElement = document.createElement('p');
            hintElement.textContent = `Pista ${currentHintIndex + 1}: ${hintText}`;
            hintElement.className = "p-3 bg-gray-700/50 rounded-lg text-sm text-gray-200 animate-fade-in";
            hintContent.appendChild(hintElement);
            
            // Renderiza la matemática si es necesario
            renderMathInElement(hintElement, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false},
                ],
                throwOnError: false
            });

            if (currentHintIndex === currentPuzzle.hints.length - 1) {
                nextHintBtn.classList.add('hidden');
            }
        }
    };

    // Event listeners para el modal de pistas
    nextHintBtn.addEventListener('click', revealNextHint);
    closeHintBtn.addEventListener('click', closeHintModal);

    renderPuzzle();
});
