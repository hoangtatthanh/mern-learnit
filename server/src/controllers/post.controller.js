const Post = require('../models/Post');

module.exports = {
    //[GET] /api/posts
    async index(req, res, next){
        try {
            const posts = await Post.find({ user: req.userId }).populate('user', ['username']);
            res.json({ success: true, posts })
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false, message: 'Internal server error'});
        }
    },

    // [POST]  api/posts
    async create (req, res) {
        const { title, description, url, status } = req.body;

        if(!title)
        return res.status(400).json({ success: false, message: 'Title is required' });

        try {
            const newPost = new Post({
                title,
                description, 
                url: url.startsWith('https://') ? url : `https://${url}`,
                status: status || 'TO LEARN',
                user: req.userId,
            })
            await newPost.save();

            res.json({ success: true, message: 'Happy learning!', post: newPost });
        } catch(err) {
            console.log(error);
            res.status(500).json({success: false, message: 'Internal server error'});
        }
    },

    // [PUT]  api/posts/:id
    async update(req, res) {
        const { title, description, url, status } = req.body

        // Simple validation
        if (!title)
            return res
                .status(400)
                .json({ success: false, message: 'Title is required' })

        try {
            let updatedPost = {
                title,
                description: description || '',
                url: (url.startsWith('https://') ? url : `https://${url}`) || '',
                status: status || 'TO LEARN',
                user: req.userId
            }

            const updatePost = await Post.findOneAndUpdate(
                { _id: req.params.id, user: req.userId },
                updatedPost,
                {new: true }
            )

            if(!updatedPost)
            return res.status(401).json({ success: false, message: 'Post not found or user not authorised'})

            res.json({ success: false, message: 'Post updated successfully', post: updatedPost })
        } catch (err) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }      
    },

    // [DELETE]  api/posts/:id
    async destroy(req, res) {
        try {
            const postDeleteCondition = { _id: req.params.id, user: req.userId }
            const deletePost = await Post.findOneAndDelete(postDeleteCondition)

            if(!deletePost)
            return res.status(401).json({ success: false, message: 'Post not found or user not authorised'})

            res.json({ success: true, post: deletePost })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
}