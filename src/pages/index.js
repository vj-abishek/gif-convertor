import React, { useState, useEffect, useRef } from 'react'
import drop from 'drag-and-drop-files';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import Layout from "../components/layout"
import SEO from "../components/seo"


const ffmpeg = createFFmpeg({ log: true })

const Helper = ({ video, ready, videoRef, convertToGif, gif, handleClick, handleChange, duration }) => {
  if (ready && video) {
    return (
      <div className="flex justify-center flex-col max-w-md">
        { video && <video
          controls
          className="w-full md:w-96"
          src={URL.createObjectURL(video)}
          ref={videoRef}>
        </video>}

        <div className="flex flex-row w-full mt-1 md:w-96">
          <input placeholder="duration"
            onChange={handleChange}
            value={duration}
            className="w-1/2 pl-2 rounded" type="number" max={videoRef.current?.duration} />
          <button onClick={handleClick} className="bg-red-600 w-1/2 dark:bg-red-300 ml-2 p-2 rounded shadow-md" >Another video</button>
        </div>

        <button className="bg-green-600 md:w-96 w-full mt-2 disabled:opacity-50 dark:bg-green-300 p-2 rounded-md shadow-md" onClick={convertToGif}>
          Convert
        </button>
        <div className="flex flex-row flex-wrap justify-center md:justify-start p-1 m-1">
          {gif && gif.map((g, i) => (
            <div className="relative">
              <img src={g} className="m-1 p-1" key={i + 1 + Math.random()} alt="autogenerated gif" width="200px" height="200px" />
              <a href={g} download={`gengif-${Date.now()}.gif`} className="absolute left-2 bottom-3 text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5V12.1578L16.2428 8.91501L17.657 10.3292L12.0001 15.9861L6.34326 10.3292L7.75748 8.91501L11 12.1575V5Z" fill="currentColor" /><path d="M4 14H6V18H18V14H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V14Z" fill="currentColor" /></svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (ready) {
    return (
      <div role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleClick}
        className="w-ful text-center cursor-pointerl h-screen w-screen max-w-full flex flex-col text-gray-600 dark:text-gray-100 justify-center items-center font-serif">
        <h1 >Select a video</h1>
      </div>
    )
  }
  return (
    <h1 className="text-gray-600 dark:text-gray-100 h-screen flex flex-col justify-center items-center">Loading...</h1>
  )
}

const IndexPage = () => {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState([]);
  const [duration, setDuration] = useState(2.5);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    drop(document.body, files => {
      console.log(files);
      setVideo(files[0])
    });
  }, [])

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.url) {
        setVideo(event.data.file);
      }
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.onmessage = handleMessage;
    }
  }, [video])

  const convertToGif = async () => {
    // Write the file to memory 
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t', `${duration}`, '-ss', `${videoRef.current.currentTime}`, '-vf', 'fps=10', '-s', '320x320', '-f', 'gif', 'out.gif');

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif([url, ...gif]);
  }

  const handleChange = (e) => {
    setDuration(e.target.value);
  }

  const handleClick = () => {
    fileRef.current.click();
  }
  return (
    <Layout>
      <SEO title="Gif Converter" />
      <input type="file" ref={fileRef} hidden onChange={(e) => {
        if (!e.target.files[0]) return;
        setVideo(e.target.files?.item(0));
      }} />

      <Helper video={video} handleChange={handleChange} duration={duration} handleClick={handleClick} ready={ready} convertToGif={convertToGif} videoRef={videoRef} gif={gif} />
    </Layout>
  )
}

export default IndexPage
