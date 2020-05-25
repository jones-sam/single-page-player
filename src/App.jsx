import React, { Component } from "react"
import "./App.css"
import axios from "axios"
import YouTubePlayer from "youtube-player"

// MUI
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"

// Icons
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import PauseIcon from "@material-ui/icons/Pause"
import SearchIcon from "@material-ui/icons/Search"

const apiKey = process.env.REACT_APP_GOOGLE_API
console.log(apiKey)

let player
export class App extends Component {
  state = {
    searchQuery: "",
    videoId: "",
    videoTitle: "",
    videoDesc: "",
    videoCreator: "",
  }

  componentDidMount = () => {
    player = YouTubePlayer("video-player", {
      videoId: this.state.videoId,
      height: "auto",
      width: "auto",
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handlePlay = () => {
    player.playVideo()
  }

  handlePause = () => {
    player.pauseVideo()
  }

  handleSubmit = (event) => {
    event.preventDefault()
    console.log(`submitted ${this.state.searchQuery}`)
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${this.state.searchQuery}&key=${apiKey}&maxResults=1&type=video`
      )
      .then((res) => {
        console.log(res.data)
        this.setState({
          videoId: res.data.items[0].id.videoId,
          videoTitle: res.data.items[0].snippet.title,
          videoDesc: res.data.items[0].snippet.description,
          videoCreator: res.data.items[0].snippet.channelTitle,
        })
        console.log(this.state.videoId)
        player.stopVideo()
        player.loadVideoById(this.state.videoId).then(() => {
          player.stopVideo()
        })
      })
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                id="search"
                label="Search"
                variant="outlined"
                name="searchQuery"
                value={this.state.searchQuery}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                fullWidth
                id="search-button"
              >
                <SearchIcon fontSize="large" />
              </Button>
            </Grid>
          </Grid>
        </form>

        <h2>{this.state.videoTitle}</h2>

        <div id="video-player"></div>
        {this.state.videoId && (
          <>
            <br />
            <Button onClick={this.handlePlay}>
              <PlayArrowIcon fontSize="large" />
            </Button>
            <Button onClick={this.handlePause}>
              <PauseIcon fontSize="large" />
            </Button>
            <br />
            <h5>
              <i>Uploaded by: </i>
              {this.state.videoCreator}
            </h5>
            <p>{this.state.videoDesc}</p>
          </>
        )}
      </div>
    )
  }
}

export default App
