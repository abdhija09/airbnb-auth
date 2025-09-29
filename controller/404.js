exports.error=(req,res,next)=>{
  res.status(404).render('store/notfound',{tittle:"page not found"
})};