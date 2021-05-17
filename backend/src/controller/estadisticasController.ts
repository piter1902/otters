import logger from '@poppinss/fancy-logs';
import Express from 'express';
import Petitions from '../models/Petitions';
import Posts from '../models/Posts';
import User from '../models/User';

interface Estadisticas {
    peticiones: {
        realizadas: number;
        atendidas: number;
        canceladas: number;
    },
    foro: {
        escritos: number;
        diaConMasPublicaciones: string;
    },
    usuarios: {
        registrados: number;
        verificados: number;
    }
}

interface ArrayDiasPosts {
    date: string;
    posts: number;
}

const getEstadisticas = async (req: Express.Request, res: Express.Response) => {
    const peticiones = await Petitions.find();
    const foro = await Posts.find();
    // Calculo del día con más publicaciones
    const dias: ArrayDiasPosts[] = [];
    let diaConMasPublicaciones = new Date(Date.now()).toISOString().substr(0, 10);
    if (foro.length !== 0) {
        (foro as any[]).forEach((post) => {
            const postDate = new Date(Date.parse(post.date)).toISOString().substr(0, 10);
            const index = dias.findIndex((d) => d.date === postDate);
            if (index == -1) {
                dias.push({
                    date: postDate,
                    posts: 1
                });
            } else {
                dias[index].posts++;
            }
        });
        dias.sort((a, b) => a.posts - b.posts);
        diaConMasPublicaciones = dias[0].date
    }
    // Usuarios
    const users = await User.find().exec();
    const estadisticas: Estadisticas = {
        peticiones: {
            realizadas: (peticiones as any[]).length,
            atendidas: (peticiones as any[]).filter((p) => p.status.toUpperCase() === "COMPLETED").length,
            canceladas: (peticiones as any[]).filter((p) => p.status.toUpperCase() === "CANCELLED").length,
        },
        foro: {
            escritos: (foro as any[]).length,
            diaConMasPublicaciones
        },
        usuarios: {
            registrados: (users as any[]).length,
            verificados: (users as any[]).filter((u) => u.isVerified).length
        }
    };
    res.status(200).json(estadisticas);
}

export default {
    getEstadisticas
}