const express = require("express")
const ejs = require("ejs")

const _ = require("lodash")
const mongoose = require("mongoose")

// mongoose load
mongoose.connect("mongodb://localhost:27017/blogDB")

const blogSchema = new mongoose.Schema({
  title: {type: String, required: true},
  body: {type: String, required: true}
})

const BlogPost = mongoose.model("BlogPost", blogSchema)


const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."

const app = express()
const port = 3000
app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.locals._ = _

var posts = [{ title: "Home", body: homeStartingContent }]

app.get("/", function (req, res) {

BlogPost.find(function(err, results){
  if (!err) {
    const postDB = results

    res.render(__dirname + "/views/home.ejs", {
      posts: postDB
    })
  }
})

  
})

app.get("/about", function (req, res) {
  res.render(__dirname + "/views/about.ejs", { aboutContent: aboutContent })
})

app.get("/contact", function (req, res) {
  res.render(__dirname + "/views/contact.ejs", {
    contactContent: contactContent,
  })
})

app.get("/compose", function (req, res) {
  res.render(__dirname + "/views/compose.ejs")
})

app.post("/compose", function (req, res) {
  // const post = {
  //   title: req.body.titleInput,
  //   body: req.body.postInput,
  // }
  // posts.push(post)
  const post = BlogPost({
    title: req.body.titleInput,
    body: req.body.postInput
  })
  post.save(function(err){
    if (!err) {
      res.redirect("/")
    }
  })
})

app.get("/post/:postTitle", function (req, res) {
  let postID = req.params.postTitle
  // let title = req.params.postTitle.toLowerCase()
  // let index = posts.map((object) => object.title.toLowerCase()).indexOf(title)
  // if (index !== -1) {
  //   res.render(__dirname + "/views/post", { post: posts[index] })
  // } else {
  //   res.write("<h1>404 Page Not Found</h1>")
  //   res.write('<a href="/">Back to Home</a>')
  //   res.send()
  BlogPost.findById(postID, function(err, results) {
    if (!err) {
      res.render(__dirname + "/views/post", {post: results})
    }
  })


  })
// })
app.get("/:input", function (req, res) {
  res.write("<h1>404 Page Not Found</h1>")
  res.write('<a href="/">Back to Home</a>')
  res.send()
})

app.listen(port, function () {
  console.log("Server started on port " + port)
})
