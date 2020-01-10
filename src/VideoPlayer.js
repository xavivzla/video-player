import React, { useRef, useEffect, useState, useCallback } from 'react'
import video from './video.mp4'

import makeStyles from '@material-ui/styles/makeStyles'
import {
  SkipPrevious as SkipPreviousIcon,
  SkipNext as SkipNextIcon,
  // VolumeDown as VolumeDownIcon,
  VolumeMute as VolumeMuteIcon,
  VolumeOff as VolumeOffIcon,
  VolumeUp as VolumeUpIcon,
  PlayArrow as PlayArrowIcon,
  StarBorder as StarBorderIcon,
  // Star as StarIcon,
  Share as ShareIcon,
  FeaturedVideo as FeaturedVideoIcon,
  Pause as PauseIcon
} from '@material-ui/icons'


const useStyles = makeStyles(theme => ({
  videoContainer: {
    position: 'relative',
    overflow: 'hidden'
  },
  progressBarActive: {
    width: 0,
    background: 'red',
    height: '5px',
    position: 'absolute',
    left: 0,
    bottom: 3,
    zIndex: 2,
    pointerEvents: 'none'
  },
  progressContainer: {
    position: 'relative'
  },
  volumeContainer: {
    '&:hover': {
      '& $volumeBar': {
        display: 'block'
      }
    },
    display: 'flex',
    alignItems: 'center',
    paddingRight: 10
  },
  volumeBar: {
    '&::-webkit-slider-thumb': {
      '-webkit-appearance': 'none',
      appearance: 'none',
      width: '12px',
      height: '12px',
      background: '#ffffff',
      cursor: 'pointer',
      borderRadius: '100%',
      boxShadow: '0px 1px 10px rgba(0, 39, 102, 0.1), 0px 4px 5px rgba(0, 39, 102, 0.06), 0px 2px 4px rgba(0, 39, 102, 0.07)'
    },
    display: 'none',
    width: '100%',
    maxWidth: '80px',
    '-webkit-appearance': 'none',
    height: '3px',
    background: '#EFEFEF',
    outline: 'none',
    opacity: '.7',
    transition: 'opacity .2s'
  },
  progressBar: {
    '&::-webkit-slider-thumb:after': {
      content: '',
      width: '100%',
      height: '5px',
      position: 'absolute',
      left: 0,
      bottom: 0,
      background: 'red'

    },
    '&::-webkit-slider-thumb': {
      '&:after': {
      },
      '-webkit-appearance': 'none',
      appearance: 'none',
      width: '15px',
      height: '15px',
      background: '#ffffff',
      cursor: 'pointer',
      borderRadius: '100%',
      zIndex: 3,
      boxShadow: '0px 1px 10px rgba(0, 39, 102, 0.1), 0px 4px 5px rgba(0, 39, 102, 0.06), 0px 2px 4px rgba(0, 39, 102, 0.07)'
    },
    width: '100%',
    '-webkit-appearance': 'none',
    height: '5px',
    background: '#EFEFEF',
    outline: 'none',
    opacity: '.7',
    transition: 'opacity .2s'
  },
  video: {
    height: '100%',
    width: '100%',
    background: 'radial-gradient(black, transparent)'
  },
  controlsContainer: {
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.8)',
    },
    position: 'absolute',
    width: '100%',
    bottom: '7px',
    // margin: '20px 0',
    boxSizing: 'border-box',
    fontSize: '14px'
  },
  controlsActionsContainer: {
    '& > div': {
      display: 'flex',
      alignItems: 'center'
    },
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  iconAction: {
    fontSize: '24px',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '12px'
  }
}), { name: 'VideoPlayer' });

const VideoPlayer = () => {

  const [paused, setPaused] = useState(true)
  const [maxDuration, setMaxDuration] = useState(null)
  const [currentTime, setCurrentTime] = useState(null)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(100)
  const [fullScreen, setFullScreen] = useState(false)
  const [progressBar, setProgressBar] = useState(0)
  const videoRef = useRef(null)

  const classes = useStyles()




  // actions

  const _handleClickPlay = () => {
    if(videoRef.current) {
      videoRef.current.play()
      setPaused(false)
    }
  }

  const _handleClickPause = () => {
    console.log('Xavi :) ===> :(: duration -> videoRef', videoRef)
    if(videoRef.current) {
      videoRef.current.pause()
      setPaused(true)
    }
  }

  const _handleClickMutedToggle = () => {
    if(videoRef)
      setMuted(prevState => {
        videoRef.current.muted = !prevState
        return !prevState
      })
  }

  const duration = () => {
    let durationTime = videoRef.current.duration
    let hour = formattedTimeHour(durationTime)
    let minutes = formattedTimeMinutes(durationTime)
    let seconds = formattedTimeSeconds(durationTime)

    let time = `${ hour ? hour + ':' : ''}${minutes}:${seconds}`
    
    setMaxDuration(time)

    setCurrentTime(time.replace(new RegExp("[0-9]", "g"), '0'))
  }

  const _handleChangeVoluneBar = (ev) => {
    let volume = ev.target.value
    videoRef.current.volume = volume / 100
    console.log('Xavi :) ===> :(: _handleChangeVoluneBar -> videoRef.current.value', videoRef.current.value)
    setVolume(volume) 

  }

  const volumeInit = () => {
    if(videoRef)
      setVolume(videoRef.current.volume * 100)
  }

  const _handleClickFullScreenToggle = () => {
    const vid = videoRef.current
    if(!fullScreen) {
      setFullScreen(prevState => {
        if (vid.parentNode.requestFullscreen) {
          vid.parentNode.requestFullscreen()
        } else if (vid.parentNode.mozRequestFullScreen) { /* Firefox */
          vid.parentNode.mozRequestFullScreen()
        } else if (vid.parentNode.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          vid.parentNode.webkitRequestFullscreen()
        } else if (vid.parentNode.msRequestFullscreen) { /* IE/Edge */
          vid.parentNode.msRequestFullscreen()
        }
        return !prevState
      })
    }else{
      setFullScreen(prevState => {
        document.exitFullscreen()
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullscreen) { /* Firefox */
          document.mozCancelFullscreen()
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
          document.webkitExitFullscreen()
        } else if (document.msExitFullscreen) { /* IE/Edge */
          document.msExitFullscreen()
        }

        return !prevState
      })
    }
  }

  const _handleClickPipScreenToggle = async () => {
    try {
      const vid = videoRef.current
      // if()
      if(vid !== document.pictureInPictureElement) {
        await vid.requestPictureInPicture()
      }else {
        document.exitPictureInPicture()
      }
      // if (video !== document.pictureInPictureElement) {
      //   pipButton.disabled = true;
      //   await video.requestPictureInPicture();
      // } else {
      //   await document.exitPictureInPicture();
      // }
    } catch (error) {
      console.error(error)
    } finally {
      // pipButton.disabled = false;
    }
  }

  const progressBarFormat = () => {
    setProgressBar(prevState => ((videoRef.current.currentTime * 100) / videoRef.current.duration).toFixed(2))
  }
  
  const _handleChangeProgressBar = (ev) => {
    let value = ev.target.value

    setProgressBar(value)
    videoRef.current.currentTime = (value * videoRef.current.duration) / 100
  }

  const _handleClickSpeedRate = (ev) => {
    videoRef.current.playbackRate = ev
  }

  const formattedTimeHour = (timestamp) => Math.floor(timestamp / 60 / 60)

  const formattedTimeMinutes = useCallback((timestamp) => Math.floor(timestamp / 60) - (formattedTimeHour(timestamp) * 60))

  const formattedTimeSeconds = (timestamp) => {
    let seconds = (timestamp % 60).toFixed()

    if(seconds <= 9)
      return `0${seconds}`
    else
      return seconds
  }

  useEffect(() => {
    if(videoRef) {
      videoRef.current.oncanplay = function() {
        duration()
        volumeInit()
      }
      videoRef.current.ontimeupdate = function() {
        let currentTime = videoRef.current.currentTime
        let hour = formattedTimeHour(currentTime)
        let minutes = formattedTimeMinutes(currentTime)
        let seconds = formattedTimeSeconds(currentTime)

        setCurrentTime(`
          ${ hour ? hour + ':' : ''}${minutes}:${seconds}
        `)

        progressBarFormat()
      }
      videoRef.current.onended = function() {
        setPaused(true)
      }
    }
      
  }, [duration, formattedTimeMinutes])

  return (
     <div className={classes.videoContainer}>
        <video
        className={classes.video}
        ref={videoRef}
        controls={false}
        preload="metadata"
        poster="poster.jpg">
          <source src={video} type="video/mp4"></source>
        </video>

          <div className={classes.controlsContainer}>
            <div className={classes.progressContainer}>
              {/* <div
                style={{
                  width: `calc(${progressBar}% - 5px)`
                }}
                className={classes.progressBarActive} /> */}
              <input
                className={classes.progressBar}
                type="range"
                min="0"
                max="100"
                onChange={ev => _handleChangeProgressBar(ev)}
                value={progressBar} />
            </div>
            <div className={classes.controlsActionsContainer}>
              <div>
                <SkipPreviousIcon className={classes.iconAction} />
                {
                  paused ?
                    <PlayArrowIcon
                    onClick={_handleClickPlay}
                    className={classes.iconAction} /> :
                    <PauseIcon
                    onClick={_handleClickPause}
                    className={classes.iconAction} />
                }
                <SkipNextIcon className={classes.iconAction} />
                <div className={classes.volumeContainer}>
                  {
                    muted ?
                    <VolumeOffIcon
                    onClick={_handleClickMutedToggle}
                    className={classes.iconAction}/> :
                    <VolumeUpIcon
                    onClick={_handleClickMutedToggle}
                    className={classes.iconAction} />
                  }
                  <input
                  className={classes.volumeBar}
                  type="range"
                  min="0"
                  max="100"
                  onChange={ev => _handleChangeVoluneBar(ev)}
                  value={volume} />
                </div>
                <small>{currentTime}/{maxDuration}</small> ---->
                <small onClick={ev => _handleClickSpeedRate(1)}>x1</small>
                <small onClick={ev => _handleClickSpeedRate(2)}>x2</small>
                <small onClick={ev => _handleClickSpeedRate(3)}>x3</small>
                <small onClick={ev => _handleClickSpeedRate(4)}>x4</small>
              </div>
              <div>
                <StarBorderIcon className={classes.iconAction} />
                <StarBorderIcon className={classes.iconAction} />
                <StarBorderIcon className={classes.iconAction} />
                <StarBorderIcon className={classes.iconAction} />
                <StarBorderIcon className={classes.iconAction} />

                <ShareIcon className={classes.iconAction} />
                <FeaturedVideoIcon
                onClick={_handleClickPipScreenToggle}
                className={classes.iconAction} />
              </div>
            </div>
          </div>
      </div> 
  )
}

export default VideoPlayer