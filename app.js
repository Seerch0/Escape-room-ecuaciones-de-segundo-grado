document.addEventListener("DOMContentLoaded", () => {
    // Arreglo de puzzles con preguntas, descripciones, soluciones y pistas.
    const puzzles = [
        {
            title: "El Candado de la Biblioteca",
            description: "Para entrar a la biblioteca y encontrar la primera pista, debes abrir un candado. La clave es la solución positiva de la siguiente ecuación:",
            question: "$$x^2 - 49 = 0$$",
            solution: [7],
            hint: "Despeja x y recuerda que la raíz cuadrada tiene una solución positiva y una negativa. ¡Solo necesitas la positiva!"
        },
        {
            title: "El Enigma del Mapa",
            description: "Una vez dentro, encuentras un mapa enrollado. Para desenrollarlo, necesitas resolver esta ecuación para encontrar la longitud del pergamino:",
            question: "$$(2x - 4)^2 = 64$$",
            solution: [-2, 6],
            hint: "Saca la raíz cuadrada a ambos lados, pero no olvides que hay dos posibles resultados para la raíz. Luego despeja x en cada caso."
        },
        {
            title: "El Código del Reloj",
            description: "El mapa te lleva a un antiguo reloj que se ha detenido. Para reiniciarlo y activar la siguiente pista, necesitas encontrar la suma de las soluciones de la siguiente ecuación:",
            question: "$$3x^2 + 9x = 0$$",
            solution: [-3, 0],
            hint: "Factoriza el factor común $x$ o $3x$ para encontrar ambas soluciones. La clave es la suma de ambas."
        },
        {
            title: "El Baúl del Tesoro",
            description: "La última pista te lleva a un baúl. La clave para abrirlo es el número de la solución de la ecuación que no es 1. ¡Este es el último desafío!",
            question: "$$x^2 - 4x + 3 = 0$$",
            solution: [1, 3],
            hint: "Usa la fórmula general o factorización para encontrar ambas soluciones. Elige la que no es 1."
        },
    ];

    // Variables de estado del juego
    let currentPuzzleIndex = 0;
    let finalCode = "";

    // Referencias a los elementos del DOM
    const gameContent = document.getElementById("game-content");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const progressBarContainer = document.getElementById("progress-bar-container");

    // Función para verificar la solución del usuario
    const checkSolution = (input, solutions) => {
        const parsedInput = parseFloat(input);
        if (isNaN(parsedInput)) {
            return false;
        }
        return solutions.some(sol => Math.abs(sol - parsedInput) < 0.001);
    };

    // Función principal para renderizar un puzzle en la pantalla
    const renderPuzzle = () => {
        const puzzle = puzzles[currentPuzzleIndex];
        gameContent.innerHTML = `
            <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">${puzzle.title}</h3>
            <p class="mb-4 text-gray-700 dark:text-gray-300">${puzzle.description}</p>
            <div id="question-container" class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4 text-center text-xl font-mono">
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
            <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-bold">Pista:</span> ${puzzle.hint}
            </p>
        `;

        // Renderizar las ecuaciones matemáticas después de cargar el HTML
        renderMathInElement(document.getElementById("question-container"), {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
            ],
            throwOnError: false
        });

        // Añadir el listener para el formulario
        document.getElementById("puzzle-form").addEventListener("submit", handleSubmit);
        updateProgressBar();
    };

    // Función para renderizar la pantalla de victoria
    const renderWinScreen = () => {
        progressBarContainer.style.display = 'none';
        gameContent.innerHTML = `
            <div class="text-center p-6 bg-green-50 dark:bg-green-900 rounded-lg shadow-inner">
                <h2 class="text-3xl font-bold text-green-700 dark:text-green-300 mb-4">¡Felicitaciones! ¡Han escapado!</h2>
                <p class="text-lg text-gray-700 dark:text-gray-200 mb-4">Han resuelto todos los enigmas y encontrado el código final. La clave es:</p>
                <div class="bg-white dark:bg-gray-800 text-3xl font-bold tracking-widest p-4 rounded-lg text-indigo-600 dark:text-indigo-400">
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

    // Función para manejar el envío del formulario
    const handleSubmit = (event) => {
        event.preventDefault();
        const inputValue = document.getElementById("answer-input").value;
        const feedbackElement = document.getElementById("feedback");
        const currentPuzzle = puzzles[currentPuzzleIndex];
        let isCorrect = false;

        // Lógica especial para los acertijos que requieren una respuesta particular (suma, etc.)
        if (currentPuzzleIndex === 2) { // Puzzle 3: Suma de las soluciones
            const solutions = currentPuzzle.solution;
            const sumOfSolutions = solutions.reduce((acc, curr) => acc + curr, 0);
            if (parseFloat(inputValue) === sumOfSolutions) {
                isCorrect = true;
                finalCode += "3";
            }
        } else if (currentPuzzleIndex === 3) { // Puzzle 4: Una solución específica
            const solutions = currentPuzzle.solution;
            if (checkSolution(inputValue, solutions) && parseFloat(inputValue) !== 1) {
                isCorrect = true;
                finalCode += "5";
            }
        } else {
            isCorrect = checkSolution(inputValue, currentPuzzle.solution);
            if (isCorrect) {
                // Partes del código final para puzzles 1 y 2
                if (currentPuzzleIndex === 0) finalCode += "7";
                if (currentPuzzleIndex === 1) finalCode += "1";
            }
        }

        if (isCorrect) {
            feedbackElement.textContent = "¡Correcto! Pista desbloqueada.";
            feedbackElement.className = "mt-2 text-center text-sm font-semibold text-green-600";
            setTimeout(() => {
                currentPuzzleIndex++;
                if (currentPuzzleIndex < puzzles.length) {
                    renderPuzzle();
                } else {
                    renderWinScreen();
                }
            }, 1000);
        } else {
            feedbackElement.textContent = "Inténtalo de nuevo. Revisa la pista.";
            feedbackElement.className = "mt-2 text-center text-sm font-semibold text-red-600";
        }
    };

    // Función para actualizar la barra de progreso
    const updateProgressBar = () => {
        const progress = ((currentPuzzleIndex + 1) / puzzles.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Pista ${currentPuzzleIndex + 1} de ${puzzles.length}`;
    };

    // Función para reiniciar el juego
    const resetGame = () => {
        currentPuzzleIndex = 0;
        finalCode = "";
        progressBarContainer.style.display = 'block';
        renderPuzzle();
    };

    // Iniciar el juego
    renderPuzzle();
});
