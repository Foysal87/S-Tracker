module.exports = {
    ensureAuthenticated : function(req,res,next){
        if(req.isAuthenticated())
        {
            return next();
        }
            req.session.returnTo = req.originalUrl; 
            req.flash('error_msg' , 'Please log in to view resource');
            res.redirect('/login');
        
    }
}