import dayjs from 'dayjs';

export const checkAgeform = (student) => {
        const currentDate = dayjs();
        const dateBirth=dayjs(student.birthdate);
        const diff = currentDate.diff(dateBirth,'year')
        const name = student.name
      
        let error={};
        if(name?.length <= 1) {
            return error= {
                error : true,
                message:`Le nom doit être superieur a un caractère ${student.name}`
            }
        } else if(diff > 110) {
            return error = {
                error : true,
                message:`T'es surement mort ${student.name}`
            }
           
         } else if(dateBirth > currentDate) {
                return error = {
                    error : true,
                    message:`Ta maman n'a pas accouché ${student.name}`
                }
        } else {
            return error = {
                error : false,
                message:`Ajout de ${student.name}`
            }
        }
}

