        let currentPokemon = null;
        let selectedMoves = [null, null, null, null];
        let team = [];

        async function searchPokemon() {
            const input = document.getElementById('pokemonInput').value.trim().toLowerCase();
            const messageDiv = document.getElementById('searchMessage');
            const infoDiv = document.getElementById('pokemonInfo');

            if (!input) {
                messageDiv.innerHTML = '<p class="error">Please enter a Pokemon name or ID.</p>';
                return;
            }

            try {
                messageDiv.innerHTML = '<p>Loading...</p>';
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
                
                if (!response.ok) {
                    throw new Error('Pokemon not found');
                }

                const data = await response.json();
                currentPokemon = data;
                selectedMoves = [null, null, null, null];
                displayPokemon(data);
                messageDiv.innerHTML = '<p class="success">Pokemon found!</p>';
            } catch (error) {
                messageDiv.innerHTML = '<p class="error">Error: ' + error.message + '</p>';
                infoDiv.innerHTML = '';
                currentPokemon = null;
            }
        }

        function displayPokemon(pokemon) {
            const infoDiv = document.getElementById('pokemonInfo');
            const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
            const soundUrl = pokemon.cries.latest || '';

            let movesDropdown = '<div class="moves-grid">';
            const availableMoves = pokemon.moves.slice(0, 20);

            for (let i = 0; i < 4; i++) {
                movesDropdown += `
                    <div class="form-group">
                        <label for="move${i}">Move ${i + 1}:</label>
                        <select id="move${i}" class="move-select" onchange="updateSelectedMove(${i}, this.value)">
                            <option value="">Select a move</option>
`;
                availableMoves.forEach(moveObj => {
                    movesDropdown += `<option value="${moveObj.move.name}">${moveObj.move.name}</option>`;
                });
                movesDropdown += `
                        </select>
                    </div>
`;
            }
            movesDropdown += '</div>';

            let soundHtml = '';
            if (soundUrl) {
                soundHtml = `<audio controls><source src="${soundUrl}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
            }

            infoDiv.innerHTML = `
                <div class="pokemon-info">
                    <h3>${pokemon.name.toUpperCase()}</h3>
                    <p>ID: ${pokemon.id}</p>
                    ${imageUrl ? `<img src="${imageUrl}" alt="${pokemon.name}" class="pokemon-image">` : '<p>No image available</p>'}
                    ${soundHtml}
                </div>
                <div>
                    <label>Select up to 4 moves:</label>
                    ${movesDropdown}
                    <button onclick="addToTeam()">Add to Team</button>
                </div>
            `;
        }

        function updateSelectedMove(index, moveName) {
            selectedMoves[index] = moveName || null;
        }

        function addToTeam() {
            if (!currentPokemon) {
                alert('Please search for a Pokemon first.');
                return;
            }

            const moves = selectedMoves.filter(move => move !== null);

            if (moves.length === 0) {
                alert('Please select at least one move.');
                return;
            }

            const teamMember = {
                id: currentPokemon.id,
                name: currentPokemon.name,
                image: currentPokemon.sprites.other['official-artwork'].front_default || currentPokemon.sprites.front_default,
                moves: selectedMoves.filter(move => move !== null)
            };

            team.push(teamMember);
            displayTeam();
            alert(`${currentPokemon.name.toUpperCase()} added to team!`);
        }

        function displayTeam() {
            const teamDiv = document.getElementById('team-display');

            if (team.length === 0) {
                teamDiv.innerHTML = '<p>No Pokemon on your team yet.</p>';
                return;
            }

            teamDiv.innerHTML = team.map((member, index) => `
                <div class="team-member">
                    <h4>${member.name.toUpperCase()}</h4>
                    ${member.image ? `<img src="${member.image}" alt="${member.name}" class="team-member-image">` : '<p>No image</p>'}
                    <div class="team-member-moves">
                        <strong>Moves:</strong>
                        ${member.moves.map(move => `<div class="move-item">• ${move}</div>`).join('')}
                    </div>
                    <button onclick="removeFromTeam(${index})" style="background-color: #d32f2f; width: 100%; margin-top: 10px;">Remove</button>
                </div>
            `).join('');
        }

        function removeFromTeam(index) {
            team.splice(index, 1);
            displayTeam();
        }

        // Allow Enter key to search
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('pokemonInput').addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    searchPokemon();
                }
            });
        });

