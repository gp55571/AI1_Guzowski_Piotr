<?php
namespace App\Model;

use App\Service\Config;

class Film
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Film
    {
        $this->id = $id;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Film
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Film
    {
        $this->description = $description;
        return $this;
    }

    public static function fromArray($array): Film
    {
        $film = new self();
        $film->fill($array);
        return $film;
    }

    public function fill($array): Film
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM film';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $films = [];
        $filmsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($filmsArray as $filmArray) {
            $films[] = self::fromArray($filmArray);
        }

        return $films;
    }

    public static function find($id): ?Film
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM film WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $filmArray = $statement->fetch(\PDO::FETCH_ASSOC);

        if (!$filmArray) {
            return null;
        }

        return Film::fromArray($filmArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));

        if (!$this->getId()) {
            $sql = "INSERT INTO film (title, description) VALUES (:title, :description)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'description' => $this->getDescription(),
            ]);

            $this->setId($pdo->lastInsertId());

        } else {
            $sql = "UPDATE film SET title = :title, description = :description WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':description' => $this->getDescription(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));

        $sql = "DELETE FROM film WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setDescription(null);
    }
}
