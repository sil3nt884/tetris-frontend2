
const menu = (req, res) => {
  res.render('index', { port: 8000 });
};

module.exports = menu;
