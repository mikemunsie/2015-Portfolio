// ===================
// Dependencies
// ===================
var _ =       require("lodash-node");
var fs =      require("fs");
var express = require('express');
var router =  express.Router();
var walk =    require('walk');

// ===================
// Globals
// ===================

var post_bgs = [
  "/public/images/bg_1.jpg",
  "/public/images/bg_2.jpg",
  "/public/images/bg_3.jpg",
  "/public/images/bg_4.jpg",
  "/public/images/bg_5.jpg",
  "/public/images/bg_6.jpg",
  "/public/images/bg_7.jpg",
  "/public/images/bg_8.jpg",
  "/public/images/bg_9.jpg",
  "/public/images/bg_10.jpg",
  "/public/images/bg_11.jpg",
  "/public/images/bg_12.jpg"
];

var postArticles = {
  projects: getCategoryArticles("projects"),
  code: getCategoryArticles("code")
};

// ===================
// Router
// ===================

router.get('/', function(req, res) {
  var article = postArticles.projects[0];

  // Get the latest article (code/projects)
  if (new Date(postArticles.code[0].date).getTime() >  new Date(postArticles.projects[0].date)) {
    article = postArticles.code[0];
  }

  req.params = article;
  req.url = article.url;
  renderBlog(req, res);
});

router.get('/code', function(req, res) {
  req.params = postArticles.code[0];
  req.url = postArticles.code[0].url;
  renderBlog(req, res);
});

router.get('/projects', function(req, res) {
  req.params = postArticles.projects[0];
  req.url = postArticles.projects[0].url;
  renderBlog(req, res);
});

router.get('/:category/:year/:month/:day/:article', function(req, res) {
  req.params = _.find(postArticles[req.params.category], req.params);
  if (!req.params) {
    res.render('404', {
      title: "404",
      preview: "This is a 404 page"
    });
    return;
  }
  renderBlog(req, res);
});

// ===================
// Routines
// ===================

/**
 * Renders the request for a blog post
 * @param  req
 * @param  res
 * @return void
 */
function renderBlog(req, res) {
  res.render(getPostFileName(req), {
    url: req.params.url,
    bg: req.params.bg,
    title: req.params.title,
    category: req.params.category,
    permLink: getPermLink(req),
    preview: req.params.preview,
    nextArticle: getNextArticle(req),
    strippedContent: req.params.strippedContent,
    articles: postArticles[req.params.category]
  });
}

/**
 * Gets the next article based on request
 * @param  req
 * @return article
 */
function getNextArticle(req) {
  var articles = postArticles[req.params.category];
  var postURL = req.url;
  var articleIndex = _.findIndex(articles, {
    url: postURL
  });
  if (articleIndex > -1) {
    if (articleIndex+1 < articles.length) {
      return articles[articleIndex+1];
    } else {
      return articles[0];
    }
  }
}
  
/**
 * Get category articles (code, projects, etc)
 * @param  req          The router request
 * @return files        Array of all the articles
 */
function getCategoryArticles(category) {
  var files = [];
  var bgCounter = -1;
  post_bgs = _.shuffle(post_bgs);
  walk.walkSync("./app/views/" + category, {
    listeners: {
      names: function (root, nodeNamesArray) {
        nodeNamesArray.sort(function (a, b) {
          return a < b ? 1 : -1;
        });
      },
      file: function (root, fileStats, next) {
        var file = "./app/views/" + category + "/" + fileStats.name;
        var contents = fs.readFileSync(file, 'utf-8');
        var blog_title = contents.match("{<title}(.*?){\/title}")[1];
        var blog_date = contents.match("{<date}(.*?){\/date}")[1];
        var blog_preview = stripHTML(contents.substring(contents.indexOf("{<content}")+10, contents.indexOf("{/content}")));
        bgCounter++;
        if (bgCounter >= post_bgs.length) {
          bgCounter = 0;
        }
        files.push({
          article: fileStats.name.match("[0-9][0-9][0-9][0-9].[0-9][0-9].[0-9][0-9].(.*)")[1].replace(".dust", ""),
          url: getPostURLFromFile(category, fileStats.name),
          bg: post_bgs[bgCounter],
          category: category,
          title: blog_title,
          date: blog_date,
          month: blog_date.match("([0-9][0-9])/([0-9][0-9])/([0-9][0-9][0-9][0-9])")[1],
          day: blog_date.match("([0-9][0-9])/([0-9][0-9])/([0-9][0-9][0-9][0-9])")[2],
          year: blog_date.match("([0-9][0-9])/([0-9][0-9])/([0-9][0-9][0-9][0-9])")[3],
          preview: truncate(blog_preview, 30),
          strippedContent: truncate(blog_preview, 30000)
        });
        next();
      },
      errors: function (root, nodeStatsArray, next) {
        next();
      }
    }
  });
  return files;
}

/**
 * Get the perm link based on request
 * @param  req
 * @return permlink
 */
function getPermLink(req) {
  return "http://munstrocity.com" + req.url;
}

/**
 * Get the blog post file name from request
 * @param  req
 * @return filename
 */
function getPostFileName(req) {
  var category = req.params.category;
  var year = req.params.year;
  var month = req.params.month;
  var day = req.params.day;
  var article = req.params.article;
  return category + '/' + year + '-' + month + '-' + day + '-' + article;
}

/**
 * Get the post url from filename
 * @param  category
 * @param  file
 * @return posturl
 */
function getPostURLFromFile(category, file) {
  return "/" + category + "/" + file.replace(/[0-9][0-9][0-9][0-9](.)[0-9][0-9](.)[0-9][0-9](.)/g, function(match) {
    return match.replace(/-/g,"/");
  }).replace(".dust", "");
}

/**
 * Strips out the HTML in a string
 * @param  content
 * @return strippedHTML
 */
function stripHTML(content) {

  // Strip out all H# tags
  content = content.replace(/<h[0-9]>.*<\/h[0-9]>/ig, "");
  
  // Remove everything else
  content = content.replace(/(<([^>]+)>)/ig, "");

  // Safe quote the shiz
  content = content.replace(/"/ig, "&quot;");

  return content;
}

/**
 * Truncates the string with a max amount of words
 * @param  content
 * @param  maxWords
 * @return content
 */
function truncate(content, maxWords) {
  content = content.replace(/\r?\n|\r|\n/g, "");
  content = content.replace(/\s\s/g, "");
  content = content.replace(/&nbsp;/g, "");
  content = content.split(" ").splice(0,maxWords).join(" ") + "...";
  return content;
}

module.exports = router;