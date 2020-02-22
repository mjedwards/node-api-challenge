const express = require("express");

const router = express.Router();

const projectFnct = require("../data/helpers/projectModel");
const actionFnct = require("../data/helpers/actionModel");

router.post("/", validateProject(), (req, res) => {
  const project = req.body;

  if (project) {
    projectFnct.insert(project).then(data => {
      res.status(201).json(data);
    });
  } else {
    res.status(400).json({ errorMessage: "Something went wrong." });
  }
});

router.post("/:id/postAction", validateProjectId(), (req, res) => {
  const text = req.body;
  const { id } = req.params;

  if (id) {
    projectFnct.getProjectActions(id).then(data => {
      if (!data) {
        res.status(400).json({ errorMessage: "Please provide information." });
      } else if (data) {
        actionFnct.insert(text).then(addAction => {
          console.log(addAction);
          res.status(201).json(addAction);
        });
      }
    });
  }
});

router.get("/", (req, res) => {
  projectFnct.get().then(projects => {
    res.status(200).json(projects);
  });
});

router.get("/:id", validateProjectId(), (req, res) => {
  const { id } = req.params;

  projectFnct.get(id).then(project => {
    res.status(200).json(project);
  });
});

router.get("/:id/actions", validateProjectId(), (req, res) => {
  const { id } = req.params;

  projectFnct.getProjectActions(id).then(projectActions => {
    res.status(200).json(projectActions);
  });
});

router.delete("/:id", validateProjectId(), (req, res) => {
  const { id } = req.params;

  projectFnct.remove(id).then(dltd => {
    if (dltd) {
      res.json({ project: "this project has been deleted." });
    } else {
      res.status(404).json({ message: "Project is not found" });
    }
  });
});

router.put("/:id", validateProjectId(), (req, res) => {
  const { id } = req.params;
  const newProject = req.body;

  projectFnct.get(id).then(updatedProject => {
    if (updatedProject) {
      projectFnct.update(id, newProject).then(project => {
        res.json(project);
      });
    } else {
      res.status(400).json({
        errorMessage: "No content found!"
      });
    }
  });
});

// middleware

function validateProjectId(req, res, next) {
  return (req, res, next) => {
    projectFnct.get(req.params.id).then(project => {
      if (project) {
        req.project = project;
      } else {
        res.status(404).json({
          errorMessage: "project not found"
        });
      }
    });
    next();
  };
}

function validateProject(req, res, next) {
  return (req, res, next) => {
    if (!req.body) {
      res.status(400).send({ errorMessage: "no project found" });
    } else {
      res.json(req.body);
    }
    next();
  };
}

// function validatePost(req, res, next) {
//   // do your magic!
//   return (req, res, next) => {
//     ud.getUserPosts(req.params.id).then(post => {
//       if (post) {
//         res.json(post);
//       } else {
//         res.status(404).json({
//           erroMessage: "post not found"
//         });
//       }
//     });
//     next();
//   };
// }

module.exports = router;
