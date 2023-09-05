import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/"

function Row({ title, fetchUrl, isLargeRow }) {
    const[movies, setMovies] = useState([]);
    const[trailerUrl, setTrailerUrl] = useState("");

    // A snippet code which runs based on specific consition/value
    useEffect(() => {
        // if [], run once when the row loads, and dont run again
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            //console.log(request.data.results);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);  

    console.log(movies);
    // Above used [fetchUrl], coz its telling useEffect that 'fetchUrl' is reading from out of the block.
 
    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.title || movie?.original_name || "")
            .then(url => {
                // https://www.youtube.com/watch?v=XtMThy8Q
                const urlParams = new URLSearchParams(new URL(url).search);
                urlParams.get('v');
            }).catch(error => console.log(error))
        }
    }

    return (
        <div className="row">
            <h2>{title}</h2>

            {/* Container -> posters */}
            <div className="row__posters">
                {/* several row__poster(s) */}

                {movies.map((movie) => (
                    <img 
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                        src={`${base_url}${
                            isLargeRow ? movie.poster_path : movie.backdrop_path
                        }`}
                        alt={movie.original_title}
                    />
                ))}
            </div>
            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row