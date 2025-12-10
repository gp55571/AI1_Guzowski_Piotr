<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Film;
use App\Service\Router;
use App\Service\Templating;

class FilmController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $films = Film::findAll();
        return $templating->render('film/index.html.php', [
            'films' => $films,
            'router' => $router,
        ]);
    }

    public function createAction(?array $requestFilm, Templating $templating, Router $router): ?string
    {
        if ($requestFilm) {
            $film = Film::fromArray($requestFilm);
            $film->save();

            $router->redirect($router->generatePath('film-index'));
            return null;
        }

        return $templating->render('film/create.html.php', [
            'film' => new Film(),
            'router' => $router,
        ]);
    }

    public function editAction(int $id, ?array $requestFilm, Templating $templating, Router $router): ?string
    {
        $film = Film::find($id);
        if (! $film) {
            throw new NotFoundException("Film $id not found");
        }

        if ($requestFilm) {
            $film->fill($requestFilm);
            $film->save();

            $router->redirect($router->generatePath('film-index'));
            return null;
        }

        return $templating->render('film/edit.html.php', [
            'film' => $film,
            'router' => $router,
        ]);
    }

    public function showAction(int $id, Templating $templating, Router $router): ?string
    {
        $film = Film::find($id);
        if (! $film) {
            throw new NotFoundException("Film $id not found");
        }

        return $templating->render('film/show.html.php', [
            'film' => $film,
            'router' => $router,
        ]);
    }

    public function deleteAction(int $id, Router $router): ?string
    {
        $film = Film::find($id);
        if (! $film) {
            throw new NotFoundException("Film $id not found");
        }

        $film->delete();
        $router->redirect($router->generatePath('film-index'));
        return null;
    }
}
